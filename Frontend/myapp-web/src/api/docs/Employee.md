# Employee


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**applicationUserId** | **string** |  | [optional] [default to undefined]
**user** | [**ApplicationUser**](ApplicationUser.md) |  | [optional] [default to undefined]
**fullName** | **string** |  | [optional] [default to undefined]
**laboratoryId** | **number** |  | [optional] [default to undefined]
**laboratory** | [**Laboratory**](Laboratory.md) |  | [optional] [default to undefined]
**registeredTests** | [**Array&lt;Test&gt;**](Test.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Employee } from './api';

const instance: Employee = {
    id,
    applicationUserId,
    user,
    fullName,
    laboratoryId,
    laboratory,
    registeredTests,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
