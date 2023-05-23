class SessionsController < ApplicationController
    def new
    end
  
    def create
      user = User.find_by(email: params[:session][:email].downcase)
  
      if user && user.authenticate(params[:session][:password])
        log_in user
        redirect_to root_path, notice: "Logged in!"
      else
        flash.now.alert = "Email or password is invalid."
        render "new"
      end
    end
  
    def destroy
      log_out
      redirect_to root_path, notice: "Logged out!"
    end
  end
  