import axios from 'axios'
import authHeader from '../../components/common/auth-header';

const BASE_URL = '';
class DataService {



	addCluster(data) {
		return axios.post(BASE_URL + '/api/admin/cluster/add', data, { headers: authHeader() });
	}

	getRequestedAccess() {
		return axios.get(BASE_URL + '/api/admin/cluster/access/requests', { headers: authHeader() });
	}

	getNewUserList() {
		return axios.get(BASE_URL + '/api/admin/user/new/requests', { headers: authHeader() });
	}

	newUserApproval(data) {
		return axios.post(BASE_URL + '/api/admin/user/new/approve', data, { headers: authHeader() });
	}

	approveCLusterAccess(data) {
		return axios.post(BASE_URL + '/api/admin/cluster/access/approve', data, { headers: authHeader() });
	}
	rejectCLusterAccess(data) {
		return axios.post(BASE_URL + '/api/admin/cluster/access/reject', data, { headers: authHeader() });
	}

	getAllClusters() {
		return axios.get(BASE_URL + '/api/clusters/getAll', { headers: authHeader() });
	}


	getClusterMetadata(data) {
		return axios.post(BASE_URL + '/api/clusters/clusterSummary', data, { headers: authHeader() });
	}
	
	getWorkerCompute(data){
		return axios.get(BASE_URL + '/api/clusters/nodes/worker/compute/'+data , { headers: authHeader() });
	}

	loginUser(data) {
		return axios.post(BASE_URL + '/api/authenticate', data);
	}

	changePassword(data) {
		return axios.post(BASE_URL + '/api/chpwd', data);
	}

	registerUser(data) {
		return axios.post(BASE_URL + '/api/users/register', data);
	}
	getUserByEmail(data) {
		return axios.get(BASE_URL + '/api/users/getOne/' + data, { headers: authHeader() });
	}
	
	getJsUserDataList() {
		return axios.get(BASE_URL + '/api/users/list/' , { headers: authHeader() });
	}

	raiseClusterAccess(data) {
		return axios.post(BASE_URL + '/api/users/requestAccess', data, { headers: authHeader() });
	}

	getResourcePerNamespaces(data) {
		return axios.post(BASE_URL + '/api/clusters/platform/label/namespaces/resources', data, { headers: authHeader() });
	}

	getPodResourcePerNamespaces(data) {
		return axios.post(BASE_URL + '/api/clusters/platform/namespaces/pods', data, { headers: authHeader() });
	}

	getCostDataPerCluster(data) {
		return axios.get(BASE_URL + '/api/clusters/getcosts/' + data, { headers: authHeader() });
	}


}

export default new DataService();