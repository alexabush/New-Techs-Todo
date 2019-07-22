defmodule PhoenixReactWeb.LanguageController do
  use PhoenixReactWeb, :controller

  alias PhoenixReact.Example
  alias PhoenixReact.Example.Language

  action_fallback PhoenixReactWeb.FallbackController

  def index(conn, _params) do
    languages = Example.list_languages()
    render(conn, "index.json", languages: languages)
  end

  def create(conn, %{"language_params" => language_params}) do
    with {:ok, %Language{} = language} <- Example.create_language(language_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.language_path(conn, :show, language))
      |> render("show.json", language: language)
    end
  end

  def show(conn, %{"id" => id}) do
    language = Example.get_language!(id)
    render(conn, "show.json", language: language)
  end
  # 
  def update(conn, %{"id" => id, "language_params" => language_params}) do
    # body = read_req_body(conn)
    # {:ok, data, _conn_details} = Plug.Conn.read_body(conn)
    # IO.puts 'in update'
    # IO.inspect params, label: "PARAMS: "
    # IO.inspect data, label: "DATA: "
    # IO.inspect conn.body_params, label: "body_params: "
    # IO.inspect conn.query_params, label: "query_params: "
    target_language = Example.get_language!(id)

    # with {:ok, %Language{} = language} <- Example.update_language(language, language_params) do
    #   render(conn, "show.json", language: language)
    # end

    IO.inspect target_language, label: "target_language: "
    language = Example.update_language(target_language, language_params)
    updated_language = Example.get_language!(id)

    IO.inspect language, label: "language: "
    render(conn, "show.json", language: updated_language)
    # render(conn, "show.json", language: elem(updated_language,1))
  end

  def delete(conn, %{"id" => id}) do
    language = Example.get_language!(id)
    with {:ok, %Language{}} <- Example.delete_language(language) do
      send_resp(conn, :no_content, "")
    end
  end
end
