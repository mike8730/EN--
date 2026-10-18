
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
    # 表示するストーリーを取得（期限切れは除外）
    @story = Story
      .where("expires_at > ?", Time.current)
      .find(params[:id])

    # 閲覧履歴を記録
    StoryRead.find_or_create_by(
      user: current_user,
      story: @story
    )

    # 有効なストーリーがあるユーザーを、
    # 最新の投稿日時が新しい順に並べる
    active_user_stories = Story
      .where("expires_at > ?", Time.current)
      .group(:user_id)
      .maximum(:created_at)
      .sort_by { |user_id, created_at| [-created_at.to_f, -user_id] }

    # ユーザーIDを一覧の左から右の順に取得
    user_ids = active_user_stories.map(&:first)

    # 有効なストーリーを取得
    all_active_stories = Story
      .where(user_id: user_ids)
      .where("expires_at > ?", Time.current)
      .order(created_at: :asc, id: :asc)
      .to_a

    # ユーザーごとにまとめ、
    # ユーザー単位で古い投稿から再生する一覧を作成
    stories_by_user = all_active_stories.group_by(&:user_id)

    @all_stories = user_ids.flat_map do |user_id|
      stories_by_user[user_id] || []
    end

    # 現在のユーザーのストーリー一覧（進行バー表示用）
    @stories = @all_stories.select do |story|
      story.user_id == @story.user_id
    end

    # 現在のユーザー内でのストーリー位置
    @index = @stories.find_index do |story|
      story.id == @story.id
    end

    # 全ユーザーを通した現在のストーリー位置
    @global_index = @all_stories.find_index do |story|
      story.id == @story.id
    end

    # 全ユーザーを通した次のストーリー
    @next_story = @all_stories[@global_index + 1] if @global_index

    # 全ユーザーを通した前のストーリー
    if @global_index && @global_index > 0
      @prev_story = @all_stories[@global_index - 1]
    end

    # 次がなければダッシュボードへ戻る
    @next_url = @next_story ? story_path(@next_story) : dashboard_path

    # 最初のストーリーより前には移動できない
    @prev_url = @prev_story ? story_path(@prev_story) : ""
  end

  private

  def story_params
    params.require(:story).permit(
      :caption,
      :media
    )
  end
end