package com.abhiroop.kubetime.cluster.restclient.http.svc;

import com.abhiroop.kubetime.cluster.restclient.http.pojo.ClusterClientBaseBuilder;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterCompute;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterMetadata;

public interface IPlatformMetadataService {

	
	int getClusterInfo(ClusterClientBaseBuilder ccb);

	ClusterMetadata getPlatformSpec(ClusterClientBaseBuilder client);
	
	ClusterCompute getClusterWorkerCompute(ClusterClientBaseBuilder ccb) throws Exception;
}
