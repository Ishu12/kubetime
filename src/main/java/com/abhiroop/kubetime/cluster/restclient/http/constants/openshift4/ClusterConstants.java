package com.abhiroop.kubetime.cluster.restclient.http.constants.openshift4;

public interface ClusterConstants {

	interface RestApiRelativePath {

		public static final String CLUSTER_SERVICE = "/api/v1/namespaces/kube-system/services?labelSelector=kubernetes.io=cluster-service";
		public static final String CLUSTER_VERSIONS = "/apis/config.openshift.io/v1/clusterversions/version";
		public static final String CLUSTER_METADATA = "/version";
		public static final String CLUSTER_NAMESPACE_LIST = "/api/v1/namespaces";
		public static final String CLUSTER_NAMESPACE_POD_RESORCE_PREFIX = "/apis/metrics.k8s.io/v1beta1/namespaces";

	}

	interface NamespaceRestApiPath {
		public static String NAMESPACE_INFO = "/apis/project.openshift.i/v1/projects/";
		public static String NAMESPACE_EDIT = "/api/v1/namespaces/";
		public static String PROJECT_REQUEST = "/apis/project.openshift.io/v1/projectrequests";
		public static String PROJECT_DELETE = "/apis/project.openshift.io/v1/projects/";
		public static String PROJECT_QUOTA = "/api/v1/namespaces/";
	}

	interface ClusterResourcePath {
		public static String CLUSTER_WORKER_NODES = "/api/v1/nodes?labelSelector=!node-role.kubernetes.io/master";
	}

	interface ResourceStatus {

		public static final String ACTIVE = "Active";
		public static final String TERMINATING = "Terminating";
		public static final String CREATED_SUCCESS = "SUCCESS";
		public static final String CREATED_FAILURE = "FAILURE";
	}

	enum MemoryUnit {

		Ki, Mi, Gi, Ti, Pi, Ei;

	}
}
