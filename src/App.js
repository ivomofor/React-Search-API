import React from 'react';
import './App.css';

const DEFAULT_QUERY = ' ';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

//const isSearched = searchTerm => item => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {result: null, searchTerm: DEFAULT_QUERY,}
    this.onDimiss = this.onDimiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onDimiss(id){
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id)
    this.setState({result:{...this.state.result, hits: updatedHits}});
  }
  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }
  setSearchTopstories(result) {
    console.log(result)
    this.setState({ result });
  }
  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result));
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
    event.preventDefault();
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

  render(){
    const { searchTerm, result } = this.state;
    return(
      <div className="page">
        <div className="interactions">
        <div>A searching API</div><br/>
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
        </div>
        <div>
        {result && <Table list={result.hits} onDismiss={this.onDimiss}/>}
        </div>
      </div>  
    );
  }
}

const Search = ({value, onChange, children, onSubmit})=> 
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <input  type="submit" value={children}/>
      </form>
 
const Table = ({ list, onDismiss })=>
        <div className="table">
          {list.map(item =>
            <div key={item.objectID} className="table-row">
              <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
              <span style={{ width: '30%' }}>{item.author}</span>
              <span style={{ width: '10%' }}>{item.num_comments}</span>
              <span style={{ width: '10%' }}>{item.points}</span>
              <span style={{ width: '10%' }}>
                <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
              </span>
            </div>
          )}
        </div>

const Button = ({onClick,className,children,}) =>
  <button onClick={onClick} className={className} type="button">{children}</button>
     
  export default App;