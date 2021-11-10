package com.abhiroop.kubetime.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abhiroop.kubetime.config.SystemConstants;
import com.abhiroop.kubetime.pojo.Cluster;
import com.abhiroop.kubetime.pojo.JsClusterAccess;
import com.abhiroop.kubetime.pojo.JsUserData;
import com.abhiroop.kubetime.pojo.ResponsePojo;
import com.abhiroop.kubetime.pojo.User;
import com.abhiroop.kubetime.pojo.UserClusterAccess;
import com.abhiroop.kubetime.svc.IUserInfoService;
import com.abhiroop.kubetime.svc.IuserClusterAccess;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserDataController {

	@Value("${ADMIN_USER_EMAIL}")
	private String adminUserEmail;

	@Value("${ADMIN_USER_PWD}")
	private String adminUserPwd;

	@Autowired
	private ClusterInfoControlller clusterCtrl;

	@Autowired
	private IUserInfoService userInfoService;

	@Autowired
	private IuserClusterAccess userClusterAccessService;

	@GetMapping("/getOne/{email}")
	public User getByEmail(@PathVariable String email) {

		return userInfoService.getOneByEmail(email);
	}

	@GetMapping("/list")
	public List<JsUserData> getAllWithAccessDetail() {
		Date date = Calendar.getInstance().getTime();
		DateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
		List<JsUserData> udList = new ArrayList<JsUserData>();

		List<User> uList = userInfoService.getAll();
		for (User user : uList) {
			JsUserData ud = new JsUserData();
			ud.setCalist(new ArrayList<JsClusterAccess>());
			ud.setEmail(user.getEmail());
			ud.setFullname(user.getFullname());
			ud.setLastUpdated(dateFormat.format(user.getCreateTime()));
			ud.setRole(user.getRole());
			ud.setStatus(user.getStatus());
			List<UserClusterAccess> ucaList = userClusterAccessService.getActiveLabelAccessPerUser(user.getUuid());
			for (UserClusterAccess uca : ucaList) {
				Cluster c = clusterCtrl.getById("" + uca.getClusterUniqueId());
				JsClusterAccess jca = new JsClusterAccess(c.getName(), uca.getAccessedLabel(), uca.getStatus());
				ud.getCalist().add(jca);
			}
			udList.add(ud);
		}

		return udList;
	}

	public User getUserById(long userId) {
		return userInfoService.getUserById(userId);
	}

	public List<String> getActiveLabelAccessPerUser(Cluster c, long userid) {

		List<String> labelList = new ArrayList<>();
		List<UserClusterAccess> ucaList = userClusterAccessService.getActiveLabelAccessPerUser(userid);

		if (!CollectionUtils.isEmpty(ucaList)) {
			System.out.println("Total " + ucaList.size() + " userClusterAccess Entry  recieved from service");
			for (UserClusterAccess userClusterAccess : ucaList) {
				if (userClusterAccess.getClusterUniqueId() == c.getUuid()) {
					labelList.add(userClusterAccess.getAccessedLabel());
				}
			}
		}
		System.out.println("Total " + labelList.size() + " number of label accessed to the user of id : " + userid);
		return labelList;
	}

	@PostMapping("/requestAccess")
	public ResponsePojo raiseClusterACcess(@RequestBody UserClusterAccess uca) {

		ResponsePojo rp = new ResponsePojo();
		rp.setObj(uca);
		rp.setMessage(SystemConstants.EntitySavedInDBFAILURE);
		if (uca != null && uca.getClusterUniqueId() != 0) {
			User usr = getByEmail(uca.getJsUserEmail());
			Cluster c = clusterCtrl.getById("" + uca.getClusterUniqueId());
			if (c != null && usr != null && StringUtils.equals(usr.getStatus(), SystemConstants.StatusActive)) {
				uca.setUserUniqueId(usr.getUuid());
				uca.setStatus(SystemConstants.UserClusterAccessRequestedStatus);
				try {
					uca = userClusterAccessService.clusterAccessRequest(uca);
					rp.setMessage(SystemConstants.EntitySavedInDBSUCCESS);
				} catch (Exception e) {
					rp.setMessage(SystemConstants.EntitySavedInDBFAILURE);
					rp.setStatus(HttpStatus.CONFLICT);
				}
			}
		}

		return rp;
	}

	@PostConstruct
	void init() {
		User user = new User();
		user.setEmail(adminUserEmail);
		user.setPwd(adminUserPwd);
		user.setRole(SystemConstants.ADMIN_USER_ROLE);
		user.setStatus(SystemConstants.StatusActive);
		user.setFullname("System Admin");

		try {
			user = userInfoService.saveUser(user, false);
			System.out.println("Admin user of email " + adminUserEmail + " created successfully.");
		} catch (Exception e) {
			System.err.println("Admin user already exists.");
		}
	}

	@PostMapping("/register")
	public ResponsePojo create(@RequestBody User user) {
		System.out.println("received request to create user =>" + user);
		ResponsePojo ar = null;
		boolean isUpdate = false;
		try {
			if (StringUtils.isEmpty(user.getFullname()) || StringUtils.isEmpty(user.getEmail())) {
				throw new RuntimeException("INVALID REQUEST : Request with Empty data.");
			} else if (!StringUtils.isEmpty(user.getRole()) && !StringUtils.isEmpty(user.getStatus())) {
				throw new RuntimeException("INVALID REQUEST : Request with malfunctioned data.");
			}

			user = userInfoService.saveUser(user, isUpdate);
			if (!isUpdate && user.getUuid() == 0) {
				ar = new ResponsePojo(HttpStatus.CONFLICT, SystemConstants.EntitySavedInDBFAILURE, user);
			} else if (!isUpdate && user.getUuid() >= 0) {
				ar = new ResponsePojo(HttpStatus.ACCEPTED, SystemConstants.EntitySavedInDBSUCCESS, user);
			}

		} catch (Exception re) {
			ar = new ResponsePojo(HttpStatus.BAD_REQUEST, SystemConstants.EntitySavedInDBFAILURE, user);
			System.err.print("Exception @ /register " + re.getMessage());
		}
		return ar;
	}
}
