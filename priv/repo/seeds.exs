# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     PhoenixReact.Repo.insert!(%PhoenixReact.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias PhoenixReact.Example
alias PhoenixReact.Example.Language
alias Example.Language

language_data = [
    %{name: "Indonesian", proverb: "Dimana ada kemauanm di situ ada jalan."},
    %{name: "Indonesian2", proverb: "Dimana ada kemauanm di situ ada jalan."},
    %{name: "Dutch", proverb: "Die goed doet, goed ontmoet."},
    %{name: "Dutch2", proverb: "Die goed doet, goed ontmoet."}
]

Enum.each(language_data, fn(data) ->
    Example.create_language(data)
end)
