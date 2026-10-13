class StoriesController < ApplicationController

  def new
    @story = Story.new
  end

  def create
    @story = current_user.stories.new(story_params)
    @story.expires_at = Time.current + 24.hours

    if @story.save
      redirect_to dashboard_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @story = Story.where("expires_at > ?", Time.current).find(params[:id])
    StoryRead.find_or_create_by(user: current_user, story: @story)

    @stories = Story
      .where(user: @story.user)
      .where("expires_at > ?", Time.current)
      .order(created_at: :asc)

    @index = @stories.find_index { |s| s.id == @story.id }

    @next_story = @stories[@index + 1]
    @prev_story = @stories[@index - 1] if @index > 0
  end


  private
  
  def story_params
    params.require(:story).permit(
      :caption,
      :media
    )
  end
end
