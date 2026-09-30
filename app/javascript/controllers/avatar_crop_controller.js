import { Controller } from "@hotwired/stimulus"
import Cropper from "cropperjs"

export default class extends Controller {
  static targets = ["input", "preview", "cropButton"]

  connect() {
    this.cropper = null
  }

  select(event) {
    const file = event.target.files[0]

    if (!file) return

    const url = URL.createObjectURL(file)

    this.previewTarget.src = url
    this.previewTarget.style.display = "block"

    if (this.cropper) {
      this.cropper.destroy()
    }

    this.cropper = new Cropper(this.previewTarget, {
      aspectRatio: 1,
      viewMode: 1,
    })

    this.cropButtonTarget.style.display = "block"
  }

  crop() {
    if (!this.cropper) return

    const canvas = this.cropper.getCroppedCanvas()
    const croppedDataUrl = canvas.toDataURL("image/jpeg")

    this.cropper.destroy()
    this.cropper = null

    this.previewTarget.src = croppedDataUrl
    this.previewTarget.style.display = "block"

    this.cropButtonTarget.style.display = "none"
  }

  reCrop() {
    if (this.cropper) return

    this.cropper = new Cropper(this.previewTarget, {
      aspectRatio: 1,
      viewMode: 1,
    })

    this.cropButtonTarget.style.display = "block"
  }

  disconnect() {
    if (this.cropper) {
      this.cropper.destroy()
    }
  }
}