import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportCharacterToPDF(characterStore, fileName = null) {
  try {
    const characterName = characterStore.name || 'Character'
    const timestamp = new Date().toISOString().split('T')[0]
    const defaultFileName = `${characterName}-${timestamp}.pdf`
    const finalFileName = fileName || defaultFileName

    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Get the main content element
    const contentElement = document.querySelector('main')
    if (!contentElement) {
      throw new Error('Could not find content to export')
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      backgroundColor: '#1e293b',
      logging: false,
      useCORS: true,
      allowTaint: true
    })

    // Calculate dimensions to fit on PDF
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add pages as needed
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Add metadata
    doc.setProperties({
      title: `${characterName} - Character Sheet`,
      subject: 'D&D 5e Character Sheet',
      author: characterName,
      keywords: 'dnd, character, sheet, 5e',
      creator: 'Lyra Character Sheet'
    })

    // Save PDF
    doc.save(finalFileName)

    return {
      success: true,
      message: `Character sheet exported as ${finalFileName}`,
      fileName: finalFileName
    }
  } catch (error) {
    console.error('Error exporting character to PDF:', error)
    return {
      success: false,
      message: `Failed to export character: ${error.message}`,
      error
    }
  }
}

// Export as JSON for backup
export function exportCharacterAsJSON(characterStore, fileName = null) {
  try {
    const characterName = characterStore.name || 'Character'
    const timestamp = new Date().toISOString().split('T')[0]
    const defaultFileName = `${characterName}-${timestamp}.json`
    const finalFileName = fileName || defaultFileName

    const dataStr = JSON.stringify(characterStore, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = finalFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return {
      success: true,
      message: `Character data exported as ${finalFileName}`,
      fileName: finalFileName
    }
  } catch (error) {
    console.error('Error exporting character data:', error)
    return {
      success: false,
      message: `Failed to export character data: ${error.message}`,
      error
    }
  }
}

// Import from JSON
export function importCharacterFromJSON(file, onSuccess, onError) {
  try {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const characterData = JSON.parse(event.target.result)
        onSuccess(characterData)
      } catch (parseError) {
        onError(`Invalid JSON file: ${parseError.message}`)
      }
    }

    reader.onerror = () => {
      onError('Failed to read file')
    }

    reader.readAsText(file)
  } catch (error) {
    onError(`Error importing character: ${error.message}`)
  }
}
