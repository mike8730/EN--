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
  validates :preferred_age_min, numericality: { allow_nil: true }
  validates :preferred_age_max, numericality: { allow_nil: true }
  validate :must_be_18_or_older
  validate :age_range_valid
  

  private

  def age_range_valid
    return if preferred_age_min.nil? || preferred_age_max.nil?
    
    if preferred_age_max < preferred_age_min
       errors.add(:preferred_age_max, "は下限より大きい必要があります")
    end
  end

  def must_be_18_or_older
    return if birthday.blank?

    if birthday > 18.years.ago.to_date
       errors.add(:birthday, "は18歳以上である必要があります")
    end
  end
end
