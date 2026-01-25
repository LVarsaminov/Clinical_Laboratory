# TestsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTestsEmployeeEmployeeIdGet**](#apitestsemployeeemployeeidget) | **GET** /api/Tests/employee/{employeeId} | |
|[**apiTestsEmployeeTestsGet**](#apitestsemployeetestsget) | **GET** /api/Tests/employee-tests | |
|[**apiTestsGet**](#apitestsget) | **GET** /api/Tests | |
|[**apiTestsIdDelete**](#apitestsiddelete) | **DELETE** /api/Tests/{id} | |
|[**apiTestsIdGet**](#apitestsidget) | **GET** /api/Tests/{id} | |
|[**apiTestsIdPut**](#apitestsidput) | **PUT** /api/Tests/{id} | |
|[**apiTestsMyTestsGet**](#apitestsmytestsget) | **GET** /api/Tests/my-tests | |
|[**apiTestsPatientPatientIdGet**](#apitestspatientpatientidget) | **GET** /api/Tests/patient/{patientId} | |
|[**apiTestsPost**](#apitestspost) | **POST** /api/Tests | |

# **apiTestsEmployeeEmployeeIdGet**
> apiTestsEmployeeEmployeeIdGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let employeeId: number; // (default to undefined)

const { status, data } = await apiInstance.apiTestsEmployeeEmployeeIdGet(
    employeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employeeId** | [**number**] |  | defaults to undefined|


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

# **apiTestsEmployeeTestsGet**
> apiTestsEmployeeTestsGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

const { status, data } = await apiInstance.apiTestsEmployeeTestsGet();
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

# **apiTestsGet**
> apiTestsGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

const { status, data } = await apiInstance.apiTestsGet();
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

# **apiTestsIdDelete**
> apiTestsIdDelete()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiTestsIdDelete(
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

# **apiTestsIdGet**
> apiTestsIdGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiTestsIdGet(
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

# **apiTestsIdPut**
> apiTestsIdPut()


### Example

```typescript
import {
    TestsApi,
    Configuration,
    Test
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let id: number; // (default to undefined)
let test: Test; // (optional)

const { status, data } = await apiInstance.apiTestsIdPut(
    id,
    test
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **test** | **Test**|  | |
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

# **apiTestsMyTestsGet**
> apiTestsMyTestsGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

const { status, data } = await apiInstance.apiTestsMyTestsGet();
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

# **apiTestsPatientPatientIdGet**
> apiTestsPatientPatientIdGet()


### Example

```typescript
import {
    TestsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let patientId: number; // (default to undefined)

const { status, data } = await apiInstance.apiTestsPatientPatientIdGet(
    patientId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patientId** | [**number**] |  | defaults to undefined|


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

# **apiTestsPost**
> apiTestsPost()


### Example

```typescript
import {
    TestsApi,
    Configuration,
    CreateTestRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TestsApi(configuration);

let createTestRequest: CreateTestRequest; // (optional)

const { status, data } = await apiInstance.apiTestsPost(
    createTestRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTestRequest** | **CreateTestRequest**|  | |


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

