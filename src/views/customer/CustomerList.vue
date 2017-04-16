<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.Name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCustomers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="customer" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="40">
			</el-table-column>
			<el-table-column type="index" width="30">
			</el-table-column>
			<el-table-column prop="Code" label="客户编码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Name" label="客户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="Age" label="年龄" width="100" sortable>
			</el-table-column>
			<el-table-column prop="Telephone" label="电话" width="140" sortable>
			</el-table-column>
			<el-table-column prop="Address" label="地址" min-width="280" sortable>
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
		<el-dialog title="编辑" v-model="editCustFormVisible" :close-on-click-modal="false">
			<el-form :model="editCustForm" label-width="120px" :rules="editCustFormRules" ref="editCustForm">
				<el-form-item label="客户编码" prop="Code">
					<el-input v-model="editCustForm.Code" disabled auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="Name">
					<el-input v-model="editCustForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editCustForm.Sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editCustForm.Age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="电话" prop="Telephone">
					<el-input v-model="editCustForm.Telephone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editCustForm.Address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editCustFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editCustLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addCustFormVisible" :close-on-click-modal="false">
			<el-form :model="addCustForm" label-width="120px" :rules="addCustFormRules" ref="addCustForm">
				<el-form-item label="客户编码" prop="Code">
					<el-input v-model="addCustForm.Code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="Name">
					<el-input v-model="addCustForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addCustForm.Sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addCustForm.Age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="电话" prop="Telephone">
					<el-input v-model="addCustForm.Telephone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addCustForm.Address"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCustFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addCustLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { 
		requsetCustomers,
		getCustomerById,
		getCustomersByUser,
		createCustomer,
		updateCustomer,
		deleteCustomer,
		batchDeleteCustomer, 
		baseUrl
	} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					Name: ''
				},
				customer: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editCustFormVisible: false,//编辑界面是否显示
				editCustLoading: false,
				editCustFormRules: {
					Code:[
						{ required: true, message: '请输入客户编码', trigger: 'blur' }
					],
					Name: [
						{ required: true, message: '请输入客户名称', trigger: 'blur' }
					],
					Telephone:[
						{ required: true, message: '请输入电话', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editCustForm: {
					id: '',
					Code: '',
					Name: '',
					Sex: -1,
					Age: 0,
					Telephone: '',
					Address: '',
					User: '',
					ModifiedBy: ''
				},

				addCustFormVisible: false,//新增界面是否显示
				addCustLoading: false,
				addCustFormRules: {
					Code:[
						{ required: true, message: '请输入客户编码', trigger: 'blur' }
					],
					Name: [
						{ required: true, message: '请输入客户名称', trigger: 'blur' }
					],
					Telephone:[
						{ required: true, message: '请输入电话', trigger: 'blur' }
					]
				},
				//新增界面数据
				addCustForm: {
					Code: '',
					Name: '',
					Sex: -1,
					Age: 0,
					Telephone: '',
					Address: '',
					User: '',
					CreatedBy: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.Sex == 1 ? '男' : row.Sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCustomers();
			},
			//获取用户列表
			getCustomers() {
				let para = {
					page: this.page,
					name: this.filters.Name
				};
				this.listLoading = true;
				//NProgress.start();
				requsetCustomers(para).then((res) => {
					if(res){
						// this.total = res.data.total;
						this.customer = res;
						this.listLoading = false;
					}
					else {
						this.$message({
							message: '无客户信息，请新增',
							type: 'warning'
						});
						this.listLoading = false;
					}
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { _id: row._id };
					deleteCustomer(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCustomers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editCustFormVisible = true;
				this.editCustForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addCustFormVisible = true;
				this.addCustForm = {
					Code:'',
					Name: '',
					Sex: -1,
					Age: 0,
					Telephone:'',
					Address: '',
					User: '',
					CreatedBy: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editCustForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editCustForm);
							var user = JSON.parse(sessionStorage.getItem('user'));
							para.ModifiedBy = user.Name;
							updateCustomer(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editCustForm'].resetFields();
								this.editCustFormVisible = false;
								this.getCustomers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addCustForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addCustForm);
							var user = JSON.parse(sessionStorage.getItem('user'));
							para.User = user._id;
							para.CreatedBy = user.Name;
							createCustomer(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addCustForm'].resetFields();
								this.addCustFormVisible = false;
								this.getCustomers();
							});
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
					batchDeleteCustomer(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCustomers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getCustomers();
		}
	}

</script>

<style scoped>

</style>