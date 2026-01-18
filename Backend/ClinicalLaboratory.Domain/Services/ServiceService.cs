using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;

namespace ClinicalLaboratory.Domain.Services
{
    public interface IServiceService
    {
        Task<IEnumerable<Service>> GetAllServicesAsync();
        Task<Service> GetServiceByIdAsync(int id);
        Task<IEnumerable<Service>> GetServicesByNameAsync(string name);
        Task<Service> CreateServiceAsync(Service service);
        Task UpdateServiceAsync(Service service);
        Task DeleteServiceAsync(int id);
    }

    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;

        public ServiceService(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<IEnumerable<Service>> GetAllServicesAsync()
        {
            return await _serviceRepository.GetAllAsync();
        }

        public async Task<Service> GetServiceByIdAsync(int id)
        {
            return await _serviceRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Service>> GetServicesByNameAsync(string name)
        {
            return await _serviceRepository.GetByNameAsync(name);
        }

        public async Task<Service> CreateServiceAsync(Service service)
        {
            if (string.IsNullOrEmpty(service.Name))
                throw new ArgumentException("Service name is required");

            if (service.Price <= 0)
                throw new ArgumentException("Service price must be greater than 0");

            return await _serviceRepository.AddAsync(service);
        }

        public async Task UpdateServiceAsync(Service service)
        {
            var existingService = await _serviceRepository.GetByIdAsync(service.Id);
            if (existingService == null)
                throw new KeyNotFoundException($"Service with ID {service.Id} not found");

            await _serviceRepository.UpdateAsync(service);
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null)
                throw new KeyNotFoundException($"Service with ID {id} not found");

            await _serviceRepository.DeleteAsync(service);
        }
    }
}