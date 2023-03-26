# Task1B Guide

This guide will guide you to provision a local Kubernetes cluster and run some Nginx containers in it.

## Recipe

1. Deploy local cluster
2. Deploy Nginx
3. Deploy Ingress controller

## 1. Deployment of a local cluster

There are many solutions out there for this purpose.

We recommend [`kind`](https://kind.sigs.k8s.io/docs/user/quick-start/) which runs nodes in containers.
In the remainder of this guide, we will assume we are using `kind`.

## Step 1.1: create cluster
We have provided you with a preconfigured kind config file in manifests/kind.
If you are in the root of this repo, run the following:  
`kind create cluster --name kind-1 --config k8s/kind/cluster-config.yaml`

## Step 1.2: verify your cluster is running on Docker
You can inspect the node containers using `docker ps` after creating the cluster.  
Also, `kubectl get nodes` will give you information about the nodes in k8s too.

After creating the cluster, try running `kubectl cluster-info` and see if 
* the control plane is running in localhost or `127.0.0.1`.
* the port matches `kind-control-plane` container's exposed port.

Example:
```
$ kubectl cluster-info
Kubernetes control plane is running at https://127.0.0.1:49709
...

$ kubectl get nodes
NAME                 STATUS   ROLES           AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE       KERNEL-VERSION      CONTAINER-RUNTIME
kind-control-plane   Ready    control-plane   152m   v1.24.0   172.20.0.3    <none>        Ubuntu 21.10   5.10.104-linuxkit   containerd://1.6.4
```

## Concepts
### Node

[Node](https://kubernetes.io/docs/concepts/architecture/nodes/) is a representation of a machine where we can run containers on.
It can be a physical server, a virtual machine, or even just a container as you have configured.

> This Node is different from "Node" in NodeJS.

There is an agent called `kubelet` that runs on it and helps us manage the node.
It is one of the most important components that define k8s.

For this module's purpose, we will not dive deeper into it.

### Context

If you have multiple clusters, you can indicate the cluster you wish to work with using `--context` flag.  
A context corresponds to an individual cluster you can connect to with a user identity.
That means you can have two contexts connecting to the same cluster with different identity.

A better way to handle context switching would be `kubectx` you can install using `krew`.

Different k8s contexts are stored in kubeconfig file at `~/.kube/config`.
You can read up more about it.

### Namespace

There is also the concept of namespace, which is more of a semantics than anything concrete, where things in different components still can interact with each other.
When a cluster is freshly created, control plane components are running in `kube-system` namespace,
whereas if namespace is not specified, you will interact with `default` namespace, namely, by default.  
When you interact with the cluster using `kubectl`, the `-n` flag helps you specify the namespace, e.g. `-n kube-system`.

There is the tool `kubens` also helps you set your namespace so that you don't have to carry `-n` flag when working in non-default namespace all the time.  
A namespace is simply an isolation mechanism to separate resources.

* https://krew.sigs.k8s.io/docs/user-guide/setup/install/
* https://github.com/ahmetb/kubectx

## 2.1 Deployment of Nginx image

In Kubernetes, the smallest deployable unit is Pod.  

<!-- [TODO]: more resources on why there is Pod. -->

All the containers exist within Pods, and a Pod hosts 1 or more closely related containers.  
For this assignment's purpose, we assume there is only 1 container in each Pod, and the concepts of Pod and container are interchangeable.

We will use a Pod object to run the NodeJS container.

However, Pod is usually treated as ephemeral, meaning that it can be terminated anytime and k8s does not guarantee its availability.

We will instead deploy the Nginx in a Deployment object.

A Deployment object specifies in its specification to k8s control unit what kind of Pod we want in the cluster running and the number of the Pods.
Refer to the example manifest.

It will create another object called ReplicaSet, whose job is specifying how many of such Pod should be running and will control their lifecycle.
> The above is unnecessary details, but you can read more about it to understand the amazingness of Deployment and k8s.

<details>
<summary>
Why is there a need for Deployment?
</summary>

This is to achieve deployment with minimal downtime and ease of use.

There used to be ReplicationController which is meant to be the only controller of Pods.
The way ReplicationController handles update is procedural,
which doesn't fit well the k8s philosophy.

Therefore, Deployment was created to handle update by creating new ReplicaSet and slowly spin up Pods with new specs
and spin down the old ones. This will ensure there are always some Pods serving user requests.
This process is further described in `spec.updateStrategy` field which you can read more about.
</details>

## Step 2.1: create a Deployment manifest

Finally, we have gotten to the core user interface of k8s: object manifests.

Each k8s object are described as a YAML file called manifest.
When you apply such manifest to the k8s cluster, it "manifests" itself as an object.

Below is the Deployment we use for a public Nginx image.

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: nginx:latest
          ports:
            - name: http
              containerPort: 80
          resources:
            limits:
              cpu: 40m
              memory: 100Mi
```

Fields breakdown:
* `apiVersion`: just copy it. It defines the version of API you are using but generally dependent on the cluster version.
* `kind`: type of the object generated by manifest, here it is `Deployment`.
* `metadata`: some fields labelling the object. We will only use `name` and `labels` for now.
* `spec`: a specification of the objects you want to generate with this manifest.

> To learn more about each field, either refer to k8s documentation on kubernetes.io or run `kubectl explain deploy.spec`.

We specify that we want to create 
* a Deployment 
* with name "backend"
* a set of labels `app=backend`
* has 3 replicas (of Pods/containers)
* that select Pods with matching label `app=backend` (generally set to the same as Deployment labels)
* and a template of Pod objects this Deployment instance will generate

Then within each Pod template, we specify:
* a set of labels `app=backend` (make sure to match that of `matchLabels`)
* with 1 container (in this module, we assume 1 Pod maps to 1 container)
* with name "backend" (doesn't really matter)
* running "latest" version of "nginx" image
* that exposes port 80 (we name the port "http" for convenience)
* and have some resource limits

> Label selector is a powerful feature that allows a user or a controller like Deployment to select
> a group of Pods. As you will see soon, the names of the Pods are all suffixed with
> randomly generated strings and are non-deterministic by design. 
> Their labels are a consistent way to identify them and use them.
> You will see this pattern in Service and Ingress objects soon.
 
You can verify if your Deployment is running fine with command  
`kubectl get deployment/backend --watch`, e.g.
```
$ kubectl get deploy/backend --watch
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
backend   3/3     3            3           21s
```

and if you want to check individual containers, check by getting the Pods using label selectors:
```
kubectl get po -lapp=backend --watch
NAME                      READY   STATUS    RESTARTS   AGE
backend-745dd6fc9-6gnwh   1/1     Running   0          104s
backend-745dd6fc9-kgq4j   1/1     Running   0          104s
backend-745dd6fc9-pwg79   1/1     Running   0          104s
```

> Note: `deploy` is the shorthand for `deployment` and `po` is short for `pod`.

### Loading Image

In order to deploy a locally built image, you need to specify the registry to pull the image from.
We can use Docker Hub repo to achieve this.  
However, there is a caveat that Docker Hub comes with the restriction of allowing 1 private repo by default.

If you want to keep your repos private, we can also [load image](https://kind.sigs.k8s.io/docs/user/quick-start/#loading-an-image-into-your-cluster) directly to kind.

## 2.2 Set up Service and Ingress

In k8s, all Pods are reachable from each other by default. 

However, each Pod will carry an arbitrarily assigned IP from a designated CIDR block on their own node.
You cannot identify a Pod or a set of Pods easily with simply IP as it will probably change.

In-cluster DNS does not solve it either as Pod DNS name will depend on its own name which carries a random hash.

A way to do it is to set up a service object in `ClusterIP` type which will create a static IP within the cluster
so that any Pod can access a set of Pods using a virtual IP.  
> Note that Such IP is not real and pinging it **will not** do anything.  
<!-- > [TODO] expand on kube-proxy if there is space. -->

However, they **cannot** be reached from the network outside the cluster (e.g. our computer).

<!-- [TODO] explain why cannot -->

There are some ways to get service exposed to the public net such as AWS load balancer controller which creates public load balancer and proxies Service object directly.

### Ingress

A canonical way of achieving this is via Ingress object.

Ingress is an abstraction of an actual application load balancer, sometimes called L7 (in OSI model) load balancer.  
If you recall the way you construct your nginx.conf in Task1A, you will see the Ingress object structure having some resemblance to it.

### Step 0: Labeling node to be Ingress ready
If you create a cluster with `kind create cluster`, the node will be missing the label `ingress-ready=true` which the controller Deployment looks for.
This means the Deployment will never be ready.

You can label the nodes retrospectively with the label using command `kubectl label node <name> ingress-ready=true`

If you get an issue using Ingress, try to check if Ingress controller is running; 
if they cannot be scheduled, check the node labels using `kubectl get nodes -L ingress-ready`.

You will also have to expose the ports from the containers, else the containers cannot be accessed.

> This is because Ingress ready node will possibly be a gateway from the public net, and we want to minimize any risks.

> If you use the `kind create` command provided above that takes in the config file we provide,
the kind cluster will open container port at localhost 80 on worker node 1 and will label it correspondingly.  
This means ingress controller will only be scheduled there.

### Step 1: Create Ingress controller(nginx-ingress-controller)

Then, you can use the manifest set from this [page](https://kind.sigs.k8s.io/docs/user/ingress/#ingress-nginx):  
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml`

> You can see that `kubectl apply -f` takes a file from the internet and applies it.
> If you open the link instead, you can see it is a YAML file containing many manifests required for Ingress-controller.

You can use this command to see the Deployment of Ingress controller being ready after some time.  
`kubectl -n ingress-nginx get deploy -w`

```
$ kubectl -n ingress-nginx get deploy
NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
ingress-nginx-controller   1/1     1            1           6m19s
```

> As you can see, Ingress controllers live in a different namespace called "ingress-nginx" by design.

<!-- [TODO] explain the architecture of this. -->

### Step 2: Create a Service for your Deployment

What Ingress does is exposing a Service to the outside world.
Therefore, you have to have a Service for your Deployment.
This Service can be ClusterIP, or even Headless. We will not cover Headless Service here.

Apply the following with `kubectl apply -f <file_with_content_below>`:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: backend
  name: backend
spec:
  selector:
    app: backend
  type: ClusterIP
  ports:
    - name: http
      port: 8080
      protocol: TCP
      targetPort: http
```

Many details are largely the same as Deployment manifest.
The differing parts are:
* `spec.type`: `ClusterIP` is used as we only want a virtual IP used within the cluster to reach all the Pods.
* `spec.ports`: an array of ports that specify the name of the port (good practice), port number, protocol used, and the target port on the Pods

> See how we are using port `http` from the Pods. This uses named port from Pod template in the Deployment.
> When you change your port number on Deployment, you don't have to change on Service.

Check service:
```
$ kubectl get svc 
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE                                                                         ✔  at kind-cluster-1 ⎈  at 19:38:50  
backend      ClusterIP   10.96.139.99   <none>        8080/TCP   2m37s
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP    7m48s
```

Apparent from the above, you can also access k8s control plane API using IP:port 10.96.0.1:443 within the cluster.

### Step 3: Create an Ingress object

The next step would be defining an Ingress object with appropriate routing rule to your Service.

For each rule, you can specify a host (in an FQDN) that is used to connect to the backend.
Under the `http` section, you can specify a set of paths to a set of backends.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: backend
  labels:
    app: backend
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$1 
spec:
  rules:
    - http:
        paths:
          - path: /app
            pathType: Prefix
            backend:
              service:
                name: backend
                port:
                  name: http
```

Likewise, we only cover what differs from other objects:
* `spec.rules`: different load balancing (routing) rule that diverts traffic. We only need 1 rule here, so skip over to next field:
* `spec.rules.http.paths.path`: the path of the HTTP query to match. This means if you can reach the Ingress via `localhost:80`, your request to `localhost:80/app` will go to the Service you specify next
* `spec.rules.http.paths.pathType`: the way you interpret the path. `Prefix` means any subpath of `/app/*` will also go to the backend
* `spec.rules.http.paths.backend`: the backend of this routing rule, which is a Service of name `backend` at port named `http`.

After applying the above with `kubectl apply -f <file_with_content_above>`, you should be able to access the backend via http://localhost/app.
Meanwhile, http://localhost will give you 404 from Nginx, which is expected.

Check your ingress:
```
$ kubectl get ingress                                                             1 ✘  took 34s   at kind-cluster-1 ⎈  at 19:38:48  
NAME      CLASS    HOSTS   ADDRESS     PORTS   AGE
backend   <none>   *       localhost   80      45s
```

> Best practice: name your port so that if you change your port from the container, you really only need to change it in one place that is Deployment object.
 
### LoadBalancer (not recommended)
A simpler way to do this is using a LoadBalancer type of Service,
which will usually be associated with a load balancer.

This load balancer can be from the cloud provider via controllers like [aws-load-balancer-controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
or locally from Docker.

However, this mechanism doesn't work well on non-Linux platforms like MacOS or Windows.

Creating LoadBalancer Service for each of N deployment will also create N cloud load balancers,
therefore increasing the cost and management complexity.

## Conclusion

By now, you should have the NodeJS server you built earlier on running in a k8s cluster that is accessible from your local environment.