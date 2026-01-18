using ClinicalLaboratory.Data.Models;
using ClinicalLaboratory.Data.Repositories;

namespace ClinicalLaboratory.Domain.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(int id);
        Task<Patient?> GetPatientByUserIdAsync(string userId);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task UpdatePatientAsync(Patient patient);
        Task DeletePatientAsync(int id);
        Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
    }

    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _patientRepository.GetAllAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            return await _patientRepository.GetWithTestsAsync(id);
        }

        public async Task<Patient?> GetPatientByUserIdAsync(string userId)
        {
            return await _patientRepository.GetByUserIdAsync(userId);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            // Validate patient data
            if (string.IsNullOrEmpty(patient.FullName))
                throw new ArgumentException("Patient full name is required");

            if (string.IsNullOrEmpty(patient.EGN))
                throw new ArgumentException("Patient EGN is required");

            // Check if EGN already exists
            var existingPatient = await _patientRepository.GetByEGNAsync(patient.EGN);
            if (existingPatient != null)
                throw new InvalidOperationException("Patient with this EGN already exists");

            return await _patientRepository.AddAsync(patient);
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            var existingPatient = await _patientRepository.GetByIdAsync(patient.Id);
            if (existingPatient == null)
                throw new KeyNotFoundException($"Patient with ID {patient.Id} not found");

            await _patientRepository.UpdateAsync(patient);
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {id} not found");

            await _patientRepository.DeleteAsync(patient);
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllPatientsAsync();

            return await _patientRepository.SearchAsync(searchTerm);
        }
    }
}