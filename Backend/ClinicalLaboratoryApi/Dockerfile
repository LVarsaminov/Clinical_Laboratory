FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Remove or fix the USER line - $APP_UID is not defined
# USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution file first
COPY ClinicalLaboratoryApi/ClinicalLaboratoryApi.sln .

# Copy project files
COPY ClinicalLaboratoryApi/ClinicalLaboratoryApi.csproj ./ClinicalLaboratoryApi/
COPY ClinicalLaboratory.Data/ClinicalLaboratory.Data.csproj ./ClinicalLaboratory.Data/
COPY ClinicalLaboratory.Domain/ClinicalLaboratory.Domain.csproj ./ClinicalLaboratory.Domain/

# Restore using the solution
RUN dotnet restore "ClinicalLaboratoryApi/ClinicalLaboratoryApi.csproj"

# Copy the rest of the code
COPY ClinicalLaboratoryApi/ ./ClinicalLaboratoryApi/
COPY ClinicalLaboratory.Data/ ./ClinicalLaboratory.Data/
COPY ClinicalLaboratory.Domain/ ./ClinicalLaboratory.Domain/

# Build the main project
WORKDIR "/src/ClinicalLaboratoryApi"
RUN dotnet build "ClinicalLaboratoryApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ClinicalLaboratoryApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ClinicalLaboratoryApi.dll"]