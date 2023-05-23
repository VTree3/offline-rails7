class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    helper_method :current_user
    helper_method :signed_in?

    def signed_in?
      current_user.present?
    end

    def log_in(user)
      session[:user_id] = user.id
    end
  
    def log_out
      session.delete(:user_id)
    end
  
    def current_user
      @current_user ||= User.find_by(id: session[:user_id])
    end
  end
  