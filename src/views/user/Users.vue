<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40">
			</el-table-column>
			<el-table-column type="index" width="30">
			</el-table-column>
			<el-table-column prop="Name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="Age" label="年龄" width="100" sortable>
			</el-table-column>
			<el-table-column prop="Birth" label="生日" width="120" :formatter="formatDate" sortable>
			</el-table-column>
			<el-table-column prop="Email" label="邮箱" width="180" sortable>
			</el-table-column>
			<el-table-column prop="Telephone" label="电话" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Address" label="地址" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑用户信息" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="Name">
					<el-input type="text" v-model="editForm.Name" disabled auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.Sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.Age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.Birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input type="email" placeholder="邮箱" v-model="editForm.Email"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input type="text" v-model="editForm.Telephone"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.Address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增用户" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="addForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.Sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.Age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.Birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input type="email" placeholder="邮箱" v-model="addForm.Email"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="addForm.Telephone"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.Address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, baseUrl } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					Name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					Name: '',
					Sex: -1,
					Age: 0,
					Email: '',
					Telephone: '',
					Birth: '',
					Address: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					Name: '',
					Sex: -1,
					Age: 0,
					Email:'',
					Birth: '',
					Email: '',
					Telephone: '',
					Address: ''
				}

			}
		},
		methods: {
			
			//性别显示转换
			formatSex: function (row, column) {
				return row.Sex == 1 ? '男' : row.Sex == 0 ? '女' : '未知';
			},
			formatDate: function (row, column){
				return row.Birth = util.formatDate.format(new Date(row.Birth), 'yyyy-MM-dd')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					Name: this.filters.Name
				};
				this.listLoading = true;
				
				this.$http.get(baseUrl + '/users/users').then((res) =>{
					this.users = res.data;
					this.listLoading = false;
				});
				// //NProgress.start();
				// getUserListPage(para).then((res) => {
				// 	this.total = res.data.total;
				// 	this.users = res.data.users;
				// 	this.listLoading = false;
				// 	//NProgress.done();
				// });
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row._id };

					this.$http.delete(baseUrl + '/user/'+para.id).then(res=>{
						this.listLoading = false;
						if(res && res.data.SucMessage){
							this.$message({
								message: res.data.SucMessage,
								type: 'success'
							});
							this.getUsers();
						} else {
							this.$message({
								message: res.data.ErrMessage,
								type: 'error'
							});
						}
					})
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					Name: '',
					Sex: -1,
					Age: 0,
					Email: '',
					Telephone: '',
					Birth: '',
					Address: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.Birth = (!para.Birth || para.Birth == '') ? '' : util.formatDate.format(new Date(para.Birth), 'yyyy-MM-dd');
							this.$http.put(baseUrl + '/user/' + para._id, para).then(res => {
								this.editLoading = false;
								if(res.data.SucMessage){
									this.$message({
										message: res.data.SucMessage,
										type: 'success'
									});

									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUsers();
								}else{
									this.$message({
										message: res.data.ErrMessage,
										type: 'error'
									});
								}
							});
							// editUser(para).then((res) => {
							// 	this.editLoading = false;
							// 	//NProgress.done();
							// 	this.$message({
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	this.$refs['editForm'].resetFields();
							// 	this.editFormVisible = false;
							// 	this.getUsers();
							// });
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.Birth = (!para.Birth || para.Birth == '') ? '' : util.formatDate.format(new Date(para.Birth), 'yyyy-MM-dd');
							para.Password = '111111'
							this.$http.post(baseUrl + '/user/createUser', para).then((res) => {
								this.addLoading = false
								if(res && res.data.SucMessage){
									this.$message({
										message: res.data.SucMessage,
										type: 'success'
									});
								}
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
							
							// addUser(para).then((res) => {
							// 	this.addLoading = false;
							// 	//NProgress.done();
							// 	this.$message({
							// 		message: '提交成功',
							// 		type: 'success'
							// 	});
							// 	this.$refs['addForm'].resetFields();
							// 	this.addFormVisible = false;
							// 	this.getUsers();
							// });
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item._id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					this.$http.delete(baseUrl + '/user/batch/' + para.ids).then(res => {
						this.listLoading = false;
						if(res && res.data.SucMessage){
							this.$message({
								message: res.data.SucMessage,
								type: 'success'
							});
							this.getUsers();
						} else {
							this.$message({
								message: res.data.ErrMessage,
								type: 'error'
							});
						}
					});
					// batchRemoveUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>