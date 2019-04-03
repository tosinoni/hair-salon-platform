export const API_URL = '/api'
export const API_USER_PATH = '/users'
export const EXECUTIVE = 'Executive'
export const ADMIN = 'Admin'

export const consultationOptions = [{ value: true, label: 'Yes' }, { value: false, label: 'No' }]
export const adminOptions = [{ value: ADMIN, label: ADMIN }, { value: EXECUTIVE, label: EXECUTIVE }]
export const maritalStatusOptions = [
  { value: 'Never Married', label: 'Never Married' },
  { value: 'Married', label: 'Married' },
  { value: 'Common Law', label: 'Common Law' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
]
export const immigrationStatuses = [
  { value: 'Visitor', label: 'Visitor' },
  { value: 'Student permit', label: 'Student permit' },
  { value: 'Work permit', label: 'Work permit' },
  { value: 'Post Grad Work Permit', label: 'Post Grad Work Permit' },
  { value: 'Temporary Resident Permit', label: 'Temporary Resident Permit' },
  { value: 'Refugee Claimant', label: 'Refugee Claimant' },
  { value: 'Failed Refugee Claimant', label: 'Failed Refugee Claimant' },
  { value: 'Protected Person/Convention Refugee', label: 'Protected Person/Convention Refugee' },
  { value: 'Permanent Resident ', label: 'Permanent Resident' },
  { value: 'Canadian Citizen', label: 'Canadian Citizen' },
  { value: 'Diplomat', label: 'Diplomat' },
  { value: 'Out of Status', label: 'Out of Status' },
  { value: 'Other', label: 'Other' },
]

export const followUpReasons = [
  { value: 'Visitor', label: 'Visitor' },
  { value: 'Student permit', label: 'Student permit' },
  { value: 'Work permit', label: 'Work permit' },
  { value: 'Extension of Visitor Status', label: 'Extension of Visitor Status' },
  { value: 'Extension of Student permit', label: 'Extension of Student permit' },
  { value: 'Extension of Work Permit', label: 'Extension of Work Permit' },
  { value: 'Extension of TRP', label: 'Extension of TRP' },
  { value: 'Post Grad Work Permit', label: 'Post Grad Work Permit' },
  { value: 'Post Grad Work Permit Extension ', label: 'Post Grad Work Permit Extension' },
  { value: 'LMIA', label: 'LMIA' },
  { value: 'Temporary Resident Permit', label: 'Temporary Resident Permit' },
  { value: 'Refugee Claim', label: 'Refugee Claim' },
  { value: 'Self Employed – PR', label: 'Self Employed – PR' },
  { value: 'High Medical Needs – PR', label: 'High Medical Needs – PR' },
  { value: 'Express Entry Profile', label: 'Express Entry Profile' },
  { value: 'Express Entry – ITA', label: 'Express Entry – ITA' },
  {
    value: 'Provincial Nomination – Express Entry',
    label: 'Provincial Nomination – Express Entry',
  },
  { value: 'Provincial Nomination - Regular', label: 'Provincial Nomination - Regular' },
  { value: 'Spousal Sponsorship in Canada', label: 'Spousal Sponsorship in Canada' },
  { value: 'Spousal Sponsorship Outside Canada', label: 'Spousal Sponsorship Outside Canada' },
  { value: 'Dependant Sponsorship', label: 'Dependant Sponsorship' },
  { value: 'Inadmissibility During Processing', label: 'Inadmissibility During Processing' },
  { value: 'Inadmissibility Hearing', label: 'Inadmissibility Hearing' },
  { value: 'Inadmissibility Interview', label: 'Inadmissibility Interview' },
  { value: 'RAD Appeal', label: 'RAD Appeal' },
  { value: 'IAD Appeal', label: 'IAD Appeal' },
  { value: 'H and C application', label: 'H and C application' },
  { value: 'Renewal of Permanent Resident Card', label: 'Renewal of Permanent Resident Card' },
  { value: 'Canadian Citizenship', label: 'Canadian Citizenship' },
  { value: 'Federal Court', label: 'Federal Court' },
  { value: 'Other', label: 'Other' },
]
