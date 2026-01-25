# ApplicationUser


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**userName** | **string** |  | [optional] [default to undefined]
**normalizedUserName** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**normalizedEmail** | **string** |  | [optional] [default to undefined]
**emailConfirmed** | **boolean** |  | [optional] [default to undefined]
**passwordHash** | **string** |  | [optional] [default to undefined]
**securityStamp** | **string** |  | [optional] [default to undefined]
**concurrencyStamp** | **string** |  | [optional] [default to undefined]
**phoneNumber** | **string** |  | [optional] [default to undefined]
**phoneNumberConfirmed** | **boolean** |  | [optional] [default to undefined]
**twoFactorEnabled** | **boolean** |  | [optional] [default to undefined]
**lockoutEnd** | **string** |  | [optional] [default to undefined]
**lockoutEnabled** | **boolean** |  | [optional] [default to undefined]
**accessFailedCount** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ApplicationUser } from './api';

const instance: ApplicationUser = {
    id,
    userName,
    normalizedUserName,
    email,
    normalizedEmail,
    emailConfirmed,
    passwordHash,
    securityStamp,
    concurrencyStamp,
    phoneNumber,
    phoneNumberConfirmed,
    twoFactorEnabled,
    lockoutEnd,
    lockoutEnabled,
    accessFailedCount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
