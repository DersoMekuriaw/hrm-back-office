import { employeeApi } from './employee.api';
import { departmentApi } from './department.api';
import { positionApi } from './position.api';
import { leaveRequestApi } from './leaveRequest.api';

export const apiReducers = {
  [employeeApi.reducerPath]: employeeApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [positionApi.reducerPath]: positionApi.reducer,
  [leaveRequestApi.reducerPath]: leaveRequestApi.reducer,
};

export const apiMiddlewares = [
  employeeApi.middleware,
  departmentApi.middleware,
  positionApi.middleware,
  leaveRequestApi.middleware,
];

export {
  employeeApi,
  departmentApi,
  positionApi,
  leaveRequestApi,
};