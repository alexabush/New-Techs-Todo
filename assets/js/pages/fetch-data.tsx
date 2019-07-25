import * as React from 'react';
import { Link } from 'react-router-dom';

import Main from '../components/Main';

// The interface for our API response
interface ApiResponse {
  data: Language[];
}

// The interface for our Language model.
interface Language {
  id: number;
  name: string;
  proverb: string;
}

interface InputField {
  onSubmit: () => void;
}

interface FetchDataExampleState {
  languages: Language[];
  loading: boolean;
  isEditId: null | number;
}

export default class FetchDataPage extends React.Component<
  {},
  FetchDataExampleState
> {
  constructor(props: {}) {
    super(props);
    this.state = { languages: [], loading: true, isEditId: 36 };

    // Get the data from our API.
  }

  componentDidMount() {
    console.log('in componentDidMount');
    fetch('/api/languages')
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        this.setState({ languages: data.data, loading: false });
      });
  }

  private onFormSubmit = (payload: object) => {
    let updatedPayload = this.reshapePayload(payload);
    console.log('in form submit');
    fetch('/api/languages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPayload)
    })
      .then(res => res.json())
      .then(({ data }) => {
        console.log('Success!', data);
        this.setState(state => {
          return { languages: [...state.languages, data] };
        });
      })
      .catch(error => console.error('I am Error:', error));
  };

  private reshapePayload = (payload: object) => {
    // Refactor to use reduce
    let modifiedPayload = {};
    modifiedPayload.name = payload.language;
    modifiedPayload.proverb = payload.proverb;
    return { language_params: modifiedPayload };
  };

  handleEdit = (id: number) => {
    this.setState({
      isEditId: id
    });
  };

  private handleUpdateSubmit = (targetId: number, data: object) => {
    console.log('handleUpdateSubmit');
    fetch(`/api/languages/${targetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...this.reshapePayload(data) })
    })
      .then(res => res.json())
      .then(({ data }) => {
        this.setState(state => {
          return {
            languages: state.languages.map(item => {
              if (item.id === targetId) {
                return data;
              }
              return item;
            })
          };
        });
      })
      .catch(error => console.error('I am Error:', error));
  };

  handleDelete = id => {
    this.onTodoDelete(id);
  };

  private onTodoDelete = (id: number) => {
    console.log('in onTodoDelete');
    fetch(`/api/languages/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(id)
    })
      .then(() => {
        console.log(`no error on item id:${id} deletion`);
        this.setState(state => {
          return {
            languages: state.languages.filter(({ id: itemId }) => {
              return itemId !== id;
            })
          };
        });
      })
      .catch(error => console.error('I am Error:', error));
  };

  private renderDisplayRow(language: Language, handleEdit, handleDelete) {
    return (
      <tr key={language.id}>
        <td>{language.name}</td>
        <td>{language.proverb}</td>
        <td>
          <div onClick={() => handleEdit(language.id)}>edit</div>
        </td>
        <td>
          <div onClick={() => handleDelete(language.id)}>Delete</div>
        </td>
      </tr>
    );
  }

  private renderLanguagesTable(languages: Language[]) {
    return (
      <table>
        <thead>
          <tr>
            <th>Language</th>
            <th>Example proverb</th>
          </tr>
        </thead>
        <tbody>
          {languages.map(language =>
            this.state.isEditId === language.id ? (
              <UpdateFormRow
                language={language}
                handleUpdateSubmit={this.handleUpdateSubmit}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
              />
            ) : (
              this.renderDisplayRow(
                language,
                this.handleEdit,
                this.handleDelete
              )
            )
          )}
        </tbody>
      </table>
    );
  }

  public render(): JSX.Element {
    console.log('in fetch-data render');
    const content = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderLanguagesTable(this.state.languages)
    );

    return (
      <Main>
        <h1>Fetch Data</h1>
        <p>
          This component demonstrates fetching data from the Phoenix API
          endpoint.
        </p>
        {content}
        <InputField onSubmit={data => this.onFormSubmit(data)} />
        <br />
        <p>
          <Link to="/">Back to home</Link>
        </p>
      </Main>
    );
  }
}

const defaultState = {
  language: '',
  proverb: ''
};

export class UpdateFormRow extends React.Component<
  {
    language: Language;
    handleUpdateSubmit: any;
    handleEdit: any;
    handleDelete: any;
  },
  {}
> {
  state = {
    language: this.props.language.name,
    proverb: this.props.language.proverb
  };
  handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    const { handleUpdateSubmit, handleEdit } = this.props;
    event.preventDefault();
    handleEdit(null);
    handleUpdateSubmit(this.props.language.id, this.state);
  };
  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
      language: { id },
      handleEdit,
      handleDelete
    } = this.props;
    const { language, proverb } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <tr key={id}>
            <td>
              <input
                name="language"
                id="language"
                type="text"
                onChange={this.handleChange}
                value={language}
              />
            </td>
            <td>
              <input
                name="proverb"
                id="proverb"
                type="text"
                onChange={this.handleChange}
                value={proverb}
              />
            </td>
            <input type="submit" value="Update" />
            <td>
              <div onClick={() => handleEdit(null)}>Cancel</div>
            </td>
            <td>
              <div onClick={() => handleDelete(language.id)}>Delete</div>
            </td>
          </tr>
        </form>
      </div>
    );
  }
}

export class InputField extends React.Component<{ InputField }, {}> {
  state = defaultState;
  handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
    this.setState(defaultState);
  };
  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="language">Language</label>
        <input
          name="language"
          id="language"
          type="text"
          onChange={this.handleChange}
          value={this.state.language}
        />
        <label htmlFor="proverb">Proverb</label>
        <input
          name="proverb"
          id="proverb"
          type="text"
          onChange={this.handleChange}
          value={this.state.proverb}
        />
        <input type="submit" value="Add Proverb" />
      </form>
    );
  }
}
