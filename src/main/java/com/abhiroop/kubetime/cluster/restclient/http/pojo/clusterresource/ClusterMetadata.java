package com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter @Setter @ToString
public class ClusterMetadata implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -4606202298579044449L;

	//response variables
	private String clusterName;
	private String clustertype;
	private String env;
	private String gitVersion;
	private String buildDate;
	private String platform;
	private String goVersion;
	private String channel;
	private String clusterId;
	private String clusterVersion;
	private String errorMessage;
	
	
	//request variables
	private String endPointUrl;
	private String token;
	
}
