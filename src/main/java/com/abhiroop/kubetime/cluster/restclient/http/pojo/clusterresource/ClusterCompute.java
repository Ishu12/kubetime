package com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;


@Getter @Setter
public class ClusterCompute implements Serializable{

	

	/**
	 * 
	 */
	private static final long serialVersionUID = 353891687674720027L;
	private String cpuCapacity;
	private String cpuAllocatable;
	private String memoryCapacity;
	private String memoryAllocatable;
	
}
