package com.abhiroop.kubetime.cluster.restclient.http;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.abhiroop.kubetime.cluster.restclient.http.pojo.ClusterClientBaseBuilder;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.KubernetesNativeClient;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.OpenshiftClient;

public class PlatformHelperFunction {

	private static Map<String, ClusterClientBaseBuilder> supportedPlatformMap = new HashMap<String, ClusterClientBaseBuilder>() {
		{
			put("OCP4", new OpenshiftClient());
			put("K8S", new KubernetesNativeClient());
		}
	};

	static ClusterClientBaseBuilder getClusterClientObject(String cType) {

		ClusterClientBaseBuilder ccb = null;
		if (StringUtils.isEmpty(cType)) {

		} else {
			ccb = supportedPlatformMap.get(cType);
		}

		return ccb;

	}
}
