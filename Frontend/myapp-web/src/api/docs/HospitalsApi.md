# HospitalsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiHospitalsGet**](#apihospitalsget) | **GET** /api/Hospitals | |
|[**apiHospitalsIdDelete**](#apihospitalsiddelete) | **DELETE** /api/Hospitals/{id} | |
|[**apiHospitalsIdGet**](#apihospitalsidget) | **GET** /api/Hospitals/{id} | |
|[**apiHospitalsIdPut**](#apihospitalsidput) | **PUT** /api/Hospitals/{id} | |
|[**apiHospitalsIdStatisticsGet**](#apihospitalsidstatisticsget) | **GET** /api/Hospitals/{id}/statistics | |
|[**apiHospitalsPost**](#apihospitalspost) | **POST** /api/Hospitals | |
|[**apiHospitalsSearchGet**](#apihospitalssearchget) | **GET** /api/Hospitals/search | |
|[**apiHospitalsWithLaboratoriesGet**](#apihospitalswithlaboratoriesget) | **GET** /api/Hospitals/with-laboratories | |

# **apiHospitalsGet**
> apiHospitalsGet()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

const { status, data } = await apiInstance.apiHospitalsGet();
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

# **apiHospitalsIdDelete**
> apiHospitalsIdDelete()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiHospitalsIdDelete(
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

# **apiHospitalsIdGet**
> apiHospitalsIdGet()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiHospitalsIdGet(
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

# **apiHospitalsIdPut**
> apiHospitalsIdPut()


### Example

```typescript
import {
    HospitalsApi,
    Configuration,
    UpdateHospitalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let id: number; // (default to undefined)
let updateHospitalRequest: UpdateHospitalRequest; // (optional)

const { status, data } = await apiInstance.apiHospitalsIdPut(
    id,
    updateHospitalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateHospitalRequest** | **UpdateHospitalRequest**|  | |
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

# **apiHospitalsIdStatisticsGet**
> apiHospitalsIdStatisticsGet()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiHospitalsIdStatisticsGet(
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

# **apiHospitalsPost**
> apiHospitalsPost()


### Example

```typescript
import {
    HospitalsApi,
    Configuration,
    CreateHospitalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let createHospitalRequest: CreateHospitalRequest; // (optional)

const { status, data } = await apiInstance.apiHospitalsPost(
    createHospitalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createHospitalRequest** | **CreateHospitalRequest**|  | |


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

# **apiHospitalsSearchGet**
> apiHospitalsSearchGet()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

let searchTerm: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiHospitalsSearchGet(
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

# **apiHospitalsWithLaboratoriesGet**
> apiHospitalsWithLaboratoriesGet()


### Example

```typescript
import {
    HospitalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HospitalsApi(configuration);

const { status, data } = await apiInstance.apiHospitalsWithLaboratoriesGet();
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

