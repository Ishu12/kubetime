package com.abhiroop.kubetime.cluster.restclient.http;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import com.abhiroop.kubetime.cluster.restclient.http.pojo.ClusterClientBaseBuilder;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.OpenshiftClient;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterCompute;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterMetadata;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.NamespaceResourceObject;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.PodResourceObject;
import com.abhiroop.kubetime.cluster.restclient.http.svc.PlatformDataServiceImpl;
import com.abhiroop.kubetime.cluster.restclient.http.svc.PlatformMetadataServiceImpl;
import com.abhiroop.kubetime.config.SystemConstants;

@RestController
@RequestMapping("/api/platforms")
public class PlatformDataController {
	// test integration with ocp ... need to refactor

	@Autowired
	private PlatformDataServiceImpl platformDataService;

	@Autowired
	private PlatformMetadataServiceImpl platformMetaDataSvc;

	@GetMapping("/nodes/worker/compute/")
	public ClusterCompute getWorkerNodesCompute(ClusterMetadata cmd) {
		ClusterCompute c = null;
		try {
			ClusterClientBaseBuilder oc = new OpenshiftClient();

			oc.withBaseUrl(cmd.getEndPointUrl());
			oc.usingToken(cmd.getToken());
			c = platformMetaDataSvc.getClusterWorkerCompute(oc);

		} catch (Exception e) {
			System.out.println("Error in getting compute resources of worker nodes" + e);
		}
		return c;
	}

	@GetMapping("/clusterServiceStatus")
	public String clusterServiceStatus(String endPoint, String token) {
		ClusterClientBaseBuilder oc = new OpenshiftClient();
		String clusterStatus = SystemConstants.StatusInActive;
		oc.withBaseUrl(endPoint);
		oc.usingToken(token);

		int result = platformMetaDataSvc.getClusterInfo(oc);

		if (result > 199 && result < 300) {
			clusterStatus = SystemConstants.StatusActive;
		}

		return clusterStatus;
	}

	@GetMapping("/getPlatformSpec")
	public ClusterMetadata getPlatformSpec(ClusterMetadata cmd) {

		ClusterClientBaseBuilder oc = PlatformHelperFunction.getClusterClientObject(cmd.getClustertype());

		if (oc != null) {
			oc.withBaseUrl(cmd.getEndPointUrl());
			oc.usingToken(cmd.getToken());
			cmd = platformMetaDataSvc.getPlatformSpec(oc);
			cmd.setClusterName(cmd.getClusterName());
		} else {
			String s = "No Platform Client found. Requested Platform, <<"+cmd.getClustertype()+" >> is not supported yet . Please contact Admin !!!";
			cmd.setErrorMessage(s);
			System.out.println(s);
		}
		return cmd;
	}

	public List<NamespaceResourceObject> getNameSpaceResources(ClusterMetadata cmd, List<String> s) {
		List<NamespaceResourceObject> nroList = new ArrayList<NamespaceResourceObject>();

		if (!CollectionUtils.isEmpty(s)) {
			ClusterClientBaseBuilder oc = new OpenshiftClient();

			oc.withBaseUrl(cmd.getEndPointUrl());
			oc.usingToken(cmd.getToken());
			for (String label : s) {
				try {
					List<String> namespaces = platformDataService.getAccessibleNameSPaces(oc, label);
					if (!CollectionUtils.isEmpty(namespaces)) {
						for (String namespace : namespaces) {
							NamespaceResourceObject nro = new NamespaceResourceObject();
							nro.setNamespaceName(namespace);
							nro.setLabelSelector(label);
							try {
								nro = platformDataService.getResourceQuota(oc, nro);
								nro = platformDataService.getVolumePerNamespace(oc, nro);
							} catch (RestClientException | ParseException rce) {
								System.out.println(
										"error in getting resources for namespace: " + namespace + ". Details: " + rce);
								if (rce instanceof ParseException) {

									nro.setErrorMessage("Data Parcing exception.");
								} else {
									nro.setErrorMessage("Api error occurred.");
								}
							}
							nroList.add(nro);
						}
					}
				} catch (Exception e) {
					System.out.print("error in getting accessible namespaces for cluster: " + cmd.getClusterId()
							+ ". Details:" + e.getMessage());
					e.printStackTrace();
				}
			}
		}

		return nroList;
	}

	@GetMapping("/namespace/podmetric")
	public List<PodResourceObject> getPodResourcePerNameSpace(ClusterMetadata cmd, String namespace) {
		List<PodResourceObject> proList = null;
		ClusterClientBaseBuilder oc = new OpenshiftClient();

		oc.withBaseUrl(cmd.getEndPointUrl());
		oc.usingToken(cmd.getToken());
		try {
			proList = platformDataService.getPodResourcePerNameSpace(oc, namespace);
		} catch (Exception e) {
			System.out
					.print("error in getting pod metric of namespaces : " + namespace + ". Details:" + e.getMessage());
			e.printStackTrace();
		}
		return proList;
	}
}
