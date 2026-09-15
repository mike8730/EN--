class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  enum gender: { male: 0, female:1 }
  enum group_role: { member: 0, organizer: 1 } 

  validates :name, presence: true
  validates :gender, presence: true
  validates :birthday, presence: true
  validates :introduction, length: { maximum: 200 }
  validates :group_role, inclusion: { in: group_roles.keys }, allow_nil: true
  validates :preferred_age_range, format: { with: /\A\d{2}-\d{2}\z/ }, allow_nil: true
end
