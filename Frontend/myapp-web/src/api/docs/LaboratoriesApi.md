# LaboratoriesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiLaboratoriesGet**](#apilaboratoriesget) | **GET** /api/Laboratories | |
|[**apiLaboratoriesHospitalHospitalIdGet**](#apilaboratorieshospitalhospitalidget) | **GET** /api/Laboratories/hospital/{hospitalId} | |
|[**apiLaboratoriesIdDelete**](#apilaboratoriesiddelete) | **DELETE** /api/Laboratories/{id} | |
|[**apiLaboratoriesIdGet**](#apilaboratoriesidget) | **GET** /api/Laboratories/{id} | |
|[**apiLaboratoriesIdPut**](#apilaboratoriesidput) | **PUT** /api/Laboratories/{id} | |
|[**apiLaboratoriesIdStatisticsGet**](#apilaboratoriesidstatisticsget) | **GET** /api/Laboratories/{id}/statistics | |
|[**apiLaboratoriesMyLaboratoryGet**](#apilaboratoriesmylaboratoryget) | **GET** /api/Laboratories/my-laboratory | |
|[**apiLaboratoriesPost**](#apilaboratoriespost) | **POST** /api/Laboratories | |

# **apiLaboratoriesGet**
> apiLaboratoriesGet()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

const { status, data } = await apiInstance.apiLaboratoriesGet();
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

# **apiLaboratoriesHospitalHospitalIdGet**
> apiLaboratoriesHospitalHospitalIdGet()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let hospitalId: number; // (default to undefined)

const { status, data } = await apiInstance.apiLaboratoriesHospitalHospitalIdGet(
    hospitalId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hospitalId** | [**number**] |  | defaults to undefined|


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

# **apiLaboratoriesIdDelete**
> apiLaboratoriesIdDelete()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiLaboratoriesIdDelete(
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

# **apiLaboratoriesIdGet**
> apiLaboratoriesIdGet()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiLaboratoriesIdGet(
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

# **apiLaboratoriesIdPut**
> apiLaboratoriesIdPut()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration,
    UpdateLaboratoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let id: number; // (default to undefined)
let updateLaboratoryRequest: UpdateLaboratoryRequest; // (optional)

const { status, data } = await apiInstance.apiLaboratoriesIdPut(
    id,
    updateLaboratoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateLaboratoryRequest** | **UpdateLaboratoryRequest**|  | |
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

# **apiLaboratoriesIdStatisticsGet**
> apiLaboratoriesIdStatisticsGet()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiLaboratoriesIdStatisticsGet(
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

# **apiLaboratoriesMyLaboratoryGet**
> apiLaboratoriesMyLaboratoryGet()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

const { status, data } = await apiInstance.apiLaboratoriesMyLaboratoryGet();
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

# **apiLaboratoriesPost**
> apiLaboratoriesPost()


### Example

```typescript
import {
    LaboratoriesApi,
    Configuration,
    CreateLaboratoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LaboratoriesApi(configuration);

let createLaboratoryRequest: CreateLaboratoryRequest; // (optional)

const { status, data } = await apiInstance.apiLaboratoriesPost(
    createLaboratoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createLaboratoryRequest** | **CreateLaboratoryRequest**|  | |


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

