class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :name,
      :gender,
      :birthday,
      :avatar,
      :introduction,
      :group_role,
      :preferred_age_range
    ])

    devise_parameter_sanitizer.permit(:account_update, keys: [
      :name,
      :gender,
      :birthday,
      :avatar,
      :introduction,
      :group_role,
      :preferred_age_range
    ])
  end
end

