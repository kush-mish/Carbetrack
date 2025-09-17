// scripts/seedEmissions.js
// Script to seed dummy emissions data for all projects in Firestore
// Usage: node scripts/seedEmissions.js <startDate> <endDate>

import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (process.argv.length < 4) {
  console.error('Usage: node scripts/seedEmissions.js <startDate> <endDate>')
  process.exit(1)
}

const startDate = new Date(process.argv[2])
const endDate = new Date(process.argv[3])
if (isNaN(startDate) || isNaN(endDate)) {
  console.error('Invalid date format. Use YYYY-MM-DD.')
  process.exit(1)
}

initializeApp({
  credential: applicationDefault(),
})

const db = getFirestore()

async function seedEmissions() {
  const projectsSnapshot = await db.collection('projects').get()
  if (projectsSnapshot.empty) {
    console.log('No projects found.')
    return
  }

  const materialsSnapshot = await db.collection('materials').get()
  if (materialsSnapshot.empty) {
    console.log('No materials found.')
    return
  }
  const materials = materialsSnapshot.docs.map((doc) => doc.data())

  for (const projectDoc of projectsSnapshot.docs) {
    const projectId = projectDoc.id
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const material = materials[Math.floor(Math.random() * materials.length)]
      const quantity = Math.floor(Math.random() * 100) + 1
      const emissionFactor = material.emissionFactor
      const totalEmissions = quantity * emissionFactor
      const emissionData = {
        projectId,
        material: material.name,
        quantity,
        unit: material.unit,
        emissionFactor,
        totalEmissions,
        date: new Date(currentDate),
      }
      await db.collection('emissions').add(emissionData)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    console.log(`Seeded emissions for project ${projectId}`)
  }
  console.log('Seeding complete.')
}

seedEmissions().catch(console.error)
