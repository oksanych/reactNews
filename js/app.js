window.ee = new EventEmitter();

// DATA
//--------------------------

var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

// News
//--------------------------

var News = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    render: function () {

        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>No news</p>
        }

        return (
            <div className="news">
                {newsTemplate}
                <strong className={'news__count ' + (data.length > 0 ? '' : 'none')}>
                    All news: {data.length}
                </strong>
            </div>
        )
    }
});

// Article
//--------------------------

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },

    getInitialState: function () {
        return {
            visible: false
        };
    },

    readmoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },

    render: function () {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#"
                   onClick={this.readmoreClick}
                   className={'news__readmore ' + (visible ? 'none' : '')}>
                    More
                </a>
                <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
            </div>
        )
    }
});

// Input
//--------------------------

var Add = React.createClass({

    getInitialState: function () {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },

    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    onBtnClickHandler: function (e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);

        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text).value;

        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },

    onCheckRuleClick: function () {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },

    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
        }
    },

    render: function () {

        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;

        return (
            <form className="add cf">
                <input type="text"
                       className="add__author"
                       onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                       placeholder="Name"
                       ref="author"/>

                <textarea className="add__text"
                          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                          placeholder="News text"
                          ref="text"
                ></textarea>

                <label className="add__checkrule">
                    <input type="checkbox"
                           defaultChecked={false}
                           ref="checkrule"
                           onChange={this.onCheckRuleClick}
                    />
                    I agree with rules
                </label>

                <button className="add__btn"
                        onClick={this.onBtnClickHandler}
                        ref='alert_button'
                        disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}>
                    Add news
                </button>
            </form>
        )
    }
});

// App
//--------------------------

var App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        };
    },

    componentDidMount: function () {
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },

    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },

    render: function () {
        return (
            <div className="app">
                <Add />
                <h3>News</h3>
                <News data={this.state.news}/>
            </div>
        )
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);