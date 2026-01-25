# Patient


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**applicationUserId** | **string** |  | [optional] [default to undefined]
**user** | [**ApplicationUser**](ApplicationUser.md) |  | [optional] [default to undefined]
**fullName** | **string** |  | [optional] [default to undefined]
**egn** | **string** |  | [optional] [default to undefined]
**tests** | [**Array&lt;Test&gt;**](Test.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Patient } from './api';

const instance: Patient = {
    id,
    applicationUserId,
    user,
    fullName,
    egn,
    tests,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
