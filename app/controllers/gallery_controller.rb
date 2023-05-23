class GalleryController < ApplicationController
    def index
        @images = Image.page(params[:page]).per(9)
      end
end
