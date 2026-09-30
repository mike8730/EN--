class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: -> { devise_controller? }

  def after_sign_in_path_for(_resource)
    dashboard_path
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [
      :name,
      :gender,
      :birthday,
      :avatar,
      :introduction,
      :group_role,
      :preferred_age_min,
      :preferred_age_max
    ])

    devise_parameter_sanitizer.permit(:account_update, keys: [
      :name,
      :gender,
      :birthday,
      :avatar,
      :introduction,
      :group_role,
      :preferred_age_min,
      :preferred_age_max
    ])
  end
end

