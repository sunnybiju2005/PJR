/**
 * HomepageContentModel
 * Encapsulates data from Firestore `homeimages` collection documents:
 * - heroimage
 * - menwear
 * - womenwear
 * - accessories
 */
export class HomepageContentModel {
  constructor(data = {}) {
    this.heroimage = this.parseDocument(data.heroimage);
    this.menwear = this.parseDocument(data.menwear);
    this.womenwear = this.parseDocument(data.womenwear);
    this.accessories = this.parseDocument(data.accessories);
  }

  parseDocument(docData) {
    if (!docData) return { title: '', type: '', imageUrls: [] };
    
    // Normalize imageUrls: can be an array or single string field (url, image, imageUrl)
    let urls = [];
    if (Array.isArray(docData.imageUrls)) {
      urls = docData.imageUrls.filter(u => u && typeof u === 'string' && u.trim() !== '');
    } else if (Array.isArray(docData.images)) {
      urls = docData.images.filter(u => u && typeof u === 'string' && u.trim() !== '');
    }

    // Support single field fallback (url, imageUrl, image)
    const singleUrl = docData.url || docData.imageUrl || docData.image || docData.heroImage || '';
    if (urls.length === 0 && singleUrl && typeof singleUrl === 'string' && singleUrl.trim() !== '') {
      urls = [singleUrl.trim()];
    }

    return {
      title: docData.title || '',
      type: docData.type || '',
      imageUrls: urls
    };
  }

  /**
   * Returns the primary Hero image URL or empty string
   */
  getHeroImageUrl() {
    return this.heroimage.imageUrls[0] || '';
  }

  /**
   * Returns the category image URL for key ('menwear', 'womenwear', 'accessories')
   */
  getCategoryImageUrl(categoryKey) {
    const key = (categoryKey || '').toLowerCase().trim();
    if (key === 'men' || key === 'menwear' || key === 'mens') {
      return this.menwear.imageUrls[0] || '';
    }
    if (key === 'women' || key === 'womenwear' || key === 'womens') {
      return this.womenwear.imageUrls[0] || '';
    }
    if (key === 'accessories' || key === 'accessory') {
      return this.accessories.imageUrls[0] || '';
    }
    return '';
  }
}
