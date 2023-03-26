# Kubernetes Guide

Kubernetes is a container orchestration solution usually used to manage tens of thousands of containers in a cluster of servers.
It is an important software system we use for the modern microservices centric models, 
where we run compute components in containers that can be easily scaled out and kept available.

We will explore some essential concepts in this task.

The canonical way of studying Kubernetes is via https://kubernetes.io/.
It contains a massive amount of information. 
We will only use a small part of it in this module.

## `kubectl`

[`kubectl`](https://kubernetes.io/docs/reference/kubectl/) is an important client tool to interact with the cluster.
You are advised to only use `kubectl` to access the cluster, unless you are confident to do it the REST way.
If you do the latter, please document it in your submission.

Please refer to the cheatsheet here https://kubernetes.io/docs/reference/kubectl/cheatsheet/

Some recommended setup are
* Setting short alias for `kubectl` to say `k`
* Set alias to simplify access to some frequently accessed namespaces, i.e. `alias ksys=kubectl -n kube-system`
* Use `kubectx` to toggle between context as described in A2 writeup

If you want to explore Kubernetes object, you can also use `kubectl explain` to explore the object in the current version.
e.g. `kubectl explain pod`, `kubectl explain deployment.spec`.

## Overview

A higher level overview of Kubernetes is described in this link https://kubernetes.io/docs/concepts/overview/components/.

We will touch the control plane minimally and will focus on getting our containers running on the Nodes.
