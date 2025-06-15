import { employeeApi } from './employee.api';
import { departmentApi } from './department.api';
import { positionApi } from './position.api';
import { leaveRequestApi } from './leaveRequest.api';
import { roleHistoryApi } from './roleHistory.api';

export const apiReducers = {
  [employeeApi.reducerPath]: employeeApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [positionApi.reducerPath]: positionApi.reducer,
  [roleHistoryApi.reducerPath]: roleHistoryApi.reducer,
  [leaveRequestApi.reducerPath]: leaveRequestApi.reducer,
};

export const apiMiddlewares = [
  employeeApi.middleware,
  departmentApi.middleware,
  roleHistoryApi.middleware,
  positionApi.middleware,
  leaveRequestApi.middleware,
];

export {
  employeeApi,
  departmentApi,
  positionApi,
  roleHistoryApi,
  leaveRequestApi,
};