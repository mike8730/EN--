class AddPreferredAgeMinMaxToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :preferred_age_min, :integer
    add_column :users, :preferred_age_max, :integer
  end
end
