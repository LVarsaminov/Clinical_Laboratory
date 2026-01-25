# PatientsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiPatientsGet**](#apipatientsget) | **GET** /api/Patients | |
|[**apiPatientsIdDelete**](#apipatientsiddelete) | **DELETE** /api/Patients/{id} | |
|[**apiPatientsIdGet**](#apipatientsidget) | **GET** /api/Patients/{id} | |
|[**apiPatientsIdPut**](#apipatientsidput) | **PUT** /api/Patients/{id} | |
|[**apiPatientsPost**](#apipatientspost) | **POST** /api/Patients | |
|[**apiPatientsSearchGet**](#apipatientssearchget) | **GET** /api/Patients/search | |

# **apiPatientsGet**
> apiPatientsGet()


### Example

```typescript
import {
    PatientsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

const { status, data } = await apiInstance.apiPatientsGet();
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

# **apiPatientsIdDelete**
> apiPatientsIdDelete()


### Example

```typescript
import {
    PatientsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiPatientsIdDelete(
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

# **apiPatientsIdGet**
> apiPatientsIdGet()


### Example

```typescript
import {
    PatientsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiPatientsIdGet(
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

# **apiPatientsIdPut**
> apiPatientsIdPut()


### Example

```typescript
import {
    PatientsApi,
    Configuration,
    Patient
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

let id: number; // (default to undefined)
let patient: Patient; // (optional)

const { status, data } = await apiInstance.apiPatientsIdPut(
    id,
    patient
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patient** | **Patient**|  | |
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

# **apiPatientsPost**
> apiPatientsPost()


### Example

```typescript
import {
    PatientsApi,
    Configuration,
    Patient
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

let patient: Patient; // (optional)

const { status, data } = await apiInstance.apiPatientsPost(
    patient
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **patient** | **Patient**|  | |


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

# **apiPatientsSearchGet**
> apiPatientsSearchGet()


### Example

```typescript
import {
    PatientsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PatientsApi(configuration);

let searchTerm: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiPatientsSearchGet(
    searchTerm
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **searchTerm** | [**string**] |  | (optional) defaults to undefined|


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

