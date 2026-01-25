# ServicesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiServicesGet**](#apiservicesget) | **GET** /api/Services | |
|[**apiServicesIdDelete**](#apiservicesiddelete) | **DELETE** /api/Services/{id} | |
|[**apiServicesIdGet**](#apiservicesidget) | **GET** /api/Services/{id} | |
|[**apiServicesIdPut**](#apiservicesidput) | **PUT** /api/Services/{id} | |
|[**apiServicesPost**](#apiservicespost) | **POST** /api/Services | |
|[**apiServicesSearchGet**](#apiservicessearchget) | **GET** /api/Services/search | |

# **apiServicesGet**
> apiServicesGet()


### Example

```typescript
import {
    ServicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

const { status, data } = await apiInstance.apiServicesGet();
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

# **apiServicesIdDelete**
> apiServicesIdDelete()


### Example

```typescript
import {
    ServicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiServicesIdDelete(
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

# **apiServicesIdGet**
> apiServicesIdGet()


### Example

```typescript
import {
    ServicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiServicesIdGet(
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

# **apiServicesIdPut**
> apiServicesIdPut()


### Example

```typescript
import {
    ServicesApi,
    Configuration,
    Service
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

let id: number; // (default to undefined)
let service: Service; // (optional)

const { status, data } = await apiInstance.apiServicesIdPut(
    id,
    service
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **service** | **Service**|  | |
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

# **apiServicesPost**
> apiServicesPost()


### Example

```typescript
import {
    ServicesApi,
    Configuration,
    Service
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

let service: Service; // (optional)

const { status, data } = await apiInstance.apiServicesPost(
    service
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **service** | **Service**|  | |


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

# **apiServicesSearchGet**
> apiServicesSearchGet()


### Example

```typescript
import {
    ServicesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ServicesApi(configuration);

let name: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiServicesSearchGet(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | (optional) defaults to undefined|


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

