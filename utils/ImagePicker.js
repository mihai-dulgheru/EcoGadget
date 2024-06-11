/**
 * Check if the image has changed
 * @param {string} imageUrl - The image URL
 * @returns {boolean} - True if the image has changed, false otherwise
 */
function hasImageChanged(imageUrl) {
  return imageUrl.startsWith('file://');
}

export { hasImageChanged };
