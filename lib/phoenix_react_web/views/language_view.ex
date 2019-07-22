defmodule PhoenixReactWeb.LanguageView do
  use PhoenixReactWeb, :view
  alias PhoenixReactWeb.LanguageView

  def render("index.json", %{languages: languages}) do
    IO.puts 'language_view'
    # IO.inspect languages, label: "INSPECTING LANGUAGES VIEW: "

    %{data: render_many(languages, LanguageView, "language.json")}
  end

  def render("show.json", %{language: language}) do
    IO.puts 'in language_view show.json'
    IO.inspect language, label: "INSPECTING LANGUAGE: "

    %{data: render_one(language, LanguageView, "language.json")}
  end

  def render("language.json", %{language: language}) do
    %{id: language.id,
      name: language.name,
      proverb: language.proverb}
  end
end
