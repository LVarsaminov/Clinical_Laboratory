# EmployeesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiEmployeesGet**](#apiemployeesget) | **GET** /api/Employees | |
|[**apiEmployeesIdDelete**](#apiemployeesiddelete) | **DELETE** /api/Employees/{id} | |
|[**apiEmployeesIdGet**](#apiemployeesidget) | **GET** /api/Employees/{id} | |
|[**apiEmployeesIdPut**](#apiemployeesidput) | **PUT** /api/Employees/{id} | |
|[**apiEmployeesLaboratoryLaboratoryIdGet**](#apiemployeeslaboratorylaboratoryidget) | **GET** /api/Employees/laboratory/{laboratoryId} | |
|[**apiEmployeesPost**](#apiemployeespost) | **POST** /api/Employees | |

# **apiEmployeesGet**
> apiEmployeesGet()


### Example

```typescript
import {
    EmployeesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

const { status, data } = await apiInstance.apiEmployeesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmployeesIdDelete**
> apiEmployeesIdDelete()


### Example

```typescript
import {
    EmployeesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiEmployeesIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmployeesIdGet**
> apiEmployeesIdGet()


### Example

```typescript
import {
    EmployeesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiEmployeesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmployeesIdPut**
> apiEmployeesIdPut()


### Example

```typescript
import {
    EmployeesApi,
    Configuration,
    Employee
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

let id: number; // (default to undefined)
let employee: Employee; // (optional)

const { status, data } = await apiInstance.apiEmployeesIdPut(
    id,
    employee
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employee** | **Employee**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmployeesLaboratoryLaboratoryIdGet**
> apiEmployeesLaboratoryLaboratoryIdGet()


### Example

```typescript
import {
    EmployeesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

let laboratoryId: number; // (default to undefined)

const { status, data } = await apiInstance.apiEmployeesLaboratoryLaboratoryIdGet(
    laboratoryId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **laboratoryId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiEmployeesPost**
> apiEmployeesPost()


### Example

```typescript
import {
    EmployeesApi,
    Configuration,
    Employee
} from './api';

const configuration = new Configuration();
const apiInstance = new EmployeesApi(configuration);

let employee: Employee; // (optional)

const { status, data } = await apiInstance.apiEmployeesPost(
    employee
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employee** | **Employee**|  | |


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

