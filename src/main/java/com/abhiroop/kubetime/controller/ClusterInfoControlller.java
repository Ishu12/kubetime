package com.abhiroop.kubetime.controller;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abhiroop.kubetime.cluster.restclient.http.PlatformDataController;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterCompute;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.ClusterMetadata;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.NamespaceResourceObject;
import com.abhiroop.kubetime.cluster.restclient.http.pojo.clusterresource.PodResourceObject;
import com.abhiroop.kubetime.pojo.Cluster;
import com.abhiroop.kubetime.pojo.ItemCost;
import com.abhiroop.kubetime.pojo.ResourceRequestObject;
import com.abhiroop.kubetime.pojo.User;
import com.abhiroop.kubetime.svc.ClusterInfoService;
import com.abhiroop.kubetime.svc.ICostService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/clusters")
public class ClusterInfoControlller {

	@Autowired
	private ClusterInfoService clusterInfoService;

	@Autowired
	private UserDataController userCtrl;

	@Autowired
	private ICostService costService;

	@Autowired
	private CacheManager cacheManager;

	@Autowired
	PlatformDataController pdc;

	@GetMapping("/health")
	public String health() {
		return "OK";
	}

	// clear all cache using cache manager
	@RequestMapping(value = "/clearCache")
	public String clearCache() {
		for (String name : cacheManager.getCacheNames()) {
			cacheManager.getCache(name).clear();
		}
		System.out.println("cache flushed successfully");
		return "cache flushed successfully";
	}

	@GetMapping("/getOne/{id}")
	public Cluster getById(@PathVariable String id) {

		return clusterInfoService.getClusterById(Long.parseLong(id));
	}

	@GetMapping("/getAllByUser/{email}")
	public List<Cluster> getAllByUserEmail(@PathVariable String userEmail) {
		return clusterInfoService.getClusterListOfUser(userEmail);
	}

	@GetMapping("/getAll")
	public List<Cluster> getAll() {

		return clusterInfoService.getClusterList();
	}

	////////////////////////// platform api connection data //////////////

	@GetMapping("/nodes/worker/compute/{id}")
	public ClusterCompute getWorkerNodeCompute(@PathVariable String id) {
		ClusterCompute cc = null;
		Cluster c = getById(id);
		if (c != null) {
			ClusterMetadata cmd = new ClusterMetadata();
			cmd.setToken(c.getToken());
			cmd.setEndPointUrl(c.getEndpoint());
			cc = pdc.getWorkerNodesCompute(cmd);
		}
		return cc;
	}

	@PostMapping("/clusterSummary")
	public ClusterMetadata getClusterSummarty(@RequestBody ClusterMetadata cmd) {
		Cluster c = getById(cmd.getClusterId());
		cmd.setEndPointUrl(c.getEndpoint());
		cmd.setToken(c.getToken());
		cmd = pdc.getPlatformSpec(cmd);
		cmd.setClusterName(c.getName());
		cmd.setEnv(c.getEnvironment());
		return cmd;
	}

	@PostMapping("/platform/label/namespaces/resources")
	public List<NamespaceResourceObject> getNameSpaceResources(@RequestBody ResourceRequestObject rqro) {

		// get cluster
		Cluster c = getById(rqro.getClusterId());
		List<NamespaceResourceObject> nroList = null;
		// session validate:TODO

		// user status validate//

		User user = userCtrl.getByEmail(rqro.getUserEmail());

		if (c != null && user != null && StringUtils.equals("A", user.getStatus())) {
			// user 's cluster access validate

			// get all labels user is authorised
			List<String> labelList = userCtrl.getActiveLabelAccessPerUser(c, user.getUuid());
			ClusterMetadata cmd = new ClusterMetadata();
			cmd.setEndPointUrl(c.getEndpoint());
			cmd.setToken(c.getToken());
			cmd.setClusterId("" + c.getUuid());

			nroList = pdc.getNameSpaceResources(cmd, labelList);
			System.out.println(
					"Total " + nroList.size() + " nameSpace Resources accessed to the user of id : " + user.getUuid());
		}
		return nroList;
	}

	@PostMapping("/platform/namespaces/pods")
	public List<PodResourceObject> getNameSpacePodMetrics(@RequestBody ResourceRequestObject rqro) {

		Cluster c = getById(rqro.getClusterId());
		ClusterMetadata cmd = new ClusterMetadata();
		cmd.setEndPointUrl(c.getEndpoint());
		cmd.setToken(c.getToken());
		cmd.setClusterId(c.getEndpoint());

		return pdc.getPodResourcePerNameSpace(cmd, rqro.getNamespace());
	}

	/////////////////////// platform api connection data //////////////

	/////////////////////// cost details//////////////

	@GetMapping("/getcosts/{id}")
	public ItemCost getAll(@PathVariable String id) {
		ItemCost ic = new ItemCost();
		long cid = 0;
		try {
			cid = Long.parseLong(id);
			ic = costService.getCostDeatilPerCluster(cid);
			ic.setUuid(0);

			System.out.println("cost per cluster data recieved");
		} catch (RuntimeException pe) {
			System.out.println(pe);
		}
		return ic;
	}

	/////////////////// cost details//////////////
}
