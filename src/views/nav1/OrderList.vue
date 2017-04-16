<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.Code" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOrders">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="Name" label="订单名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Code" label="订单编码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="CustomerName" label="客户名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="ProductCode" label="产品编码" width="120" sortable>
			</el-table-column>
			<el-table-column prop="ProductName" label="产品名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Qty" label="订单数量" width="120" sortable>
			</el-table-column>
			<el-table-column prop="Price" label="单价" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="Amount" label="订单金额" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="OrderTime" label="下单时间" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="StoreCode" label="门店编码" min-width="120" sortable>
			</el-table-column>
			<el-table-column prop="StoreName" label="门店名称" min-width="120" sortable>
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="订单编码" prop="Code">
					<el-input v-model="editForm.Code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单名称" prop="Name">
					<el-input v-model="editForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="CustomerName">
					<el-input v-model="editForm.CustomerName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="产品编码" prop="ProductCode">
					<el-input v-model="editForm.ProductCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="ProductName">
					<el-input v-model="editForm.ProductName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单数量">
					<el-input-number v-model="editForm.Qty"></el-input-number>
				</el-form-item>
				<el-form-item label="单价">
					<el-input-number v-model="editForm.Price"></el-input-number>
				</el-form-item>
				<el-form-item label="订单金额">
					<el-input-number v-model="editForm.Amount"></el-input-number>
				</el-form-item>
				<el-form-item label="下单时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.OrderTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="门店编码" prop="StoreCode">
					<el-input v-model="editForm.StoreCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="门店名称" prop="StoreName">
					<el-input v-model="editForm.StoreName" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="订单编码" prop="Code">
					<el-input v-model="addForm.Code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单名称" prop="Name">
					<el-input v-model="addForm.Name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="CustomerName">
					<el-input v-model="addForm.CustomerName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="产品编码" prop="ProductCode">
					<el-input v-model="addForm.ProductCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="产品名称" prop="ProductName">
					<el-input v-model="addForm.ProductName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="订单数量">
					<el-input-number v-model="addForm.Qty"></el-input-number>
				</el-form-item>
				<el-form-item label="单价">
					<el-input-number v-model="addForm.Price"></el-input-number>
				</el-form-item>
				<el-form-item label="订单金额">
					<el-input-number v-model="addForm.Amount"></el-input-number>
				</el-form-item>
				<el-form-item label="下单时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.OrderTime"></el-date-picker>
				</el-form-item>
				<el-form-item label="门店编码" prop="StoreCode">
					<el-input v-model="addForm.StoreCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="门店名称" prop="StoreName">
					<el-input v-model="addForm.StoreName" auto-complete="off"></el-input>
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
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.users;
					this.listLoading = false;
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
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
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
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
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
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
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