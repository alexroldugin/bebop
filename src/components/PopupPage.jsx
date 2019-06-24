import React from 'react';
import PropTypes from 'prop-types';
import getMessage from '../utils/i18n';
import Candidate from './Candidate';

class PopupPage extends React.Component {
  static get propTypes() {
    return {
      candidates:            PropTypes.arrayOf(PropTypes.object).isRequired,
      separators:            PropTypes.arrayOf(PropTypes.object).isRequired,
      index:                 PropTypes.number,
      markedCandidateIds:    PropTypes.shape({ id: PropTypes.bool }).isRequired,
      mode:                  PropTypes.string.isRequired,
      handleSelectCandidate: PropTypes.func.isRequired,
      handleInputChange:     PropTypes.func.isRequired,
      handleKeyDown:         PropTypes.func.isRequired,
      dispatchQuit:          PropTypes.func.isRequired,
      scheme:                PropTypes.shape({
        type:    PropTypes.string,
        title:   PropTypes.string,
        minimum: PropTypes.number,
        maximum: PropTypes.number,
      }).isRequired,
    };
  }

  static get defaultProps() {
    return {
      index: null,
    };
  }

  constructor() {
    super();
    this.input = null;
    this.setTextInputRef = (element) => {
      this.input = element;
    };
    this.focusTextInput = () => {
      if (this.input) this.input.focus();
    };
  }

  componentDidMount() {
    window.addEventListener('focus', this.focusTextInput);
    window.addEventListener('blur', this.props.dispatchQuit);
    this.focusTextInput();

    this.timer = setTimeout(() => {
      this.focusTextInput();
      if (document.scrollingElement) {
        document.scrollingElement.scrollTo(0, 0);
      }
    }, 100);
  }

  componentDidUpdate() {
    if (this.selectedCandidate && document.scrollingElement) {
      const container               = document.scrollingElement;
      const containerHeight         = container.clientHeight;
      const { bottom, top, height } = this.selectedCandidate.getBoundingClientRect();
      const b = containerHeight - height - 18 - container.scrollTop;
      if (bottom > containerHeight || top < 0) {
        container.scrollTop = top - b;
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.focusTextInput);
    window.removeEventListener('blur', this.props.dispatchQuit);
    clearTimeout(this.timer);
  }

  handleCandidateClick(index) {
    const candidate = this.props.candidates[index];
    if (candidate !== null) {
      this.props.handleSelectCandidate(candidate);
    }
  }

  argMessage() {
    const {
      type,
      title,
      minimum,
      maximum,
    } = this.props.scheme;
    let message = `Enter argument ${title}: ${type}`;
    switch (type) {
      case 'number': {
        if (minimum !== undefined) {
          message += `(N >= ${minimum})`;
        }
        if (maximum !== undefined) {
          message += `(N <= ${maximum})`;
        }
        break;
      }
      default:
        break;
    }
    return message;
  }

  hasFooter() {
    return this.props.mode !== 'action';
  }

  renderFooter() {
    switch (this.props.mode) {
      case 'candidate':
        return <div className="footer">{getMessage('key_info')}</div>;
      case 'action':
        return null;
      case 'arg':
        return <div className="footer">{this.argMessage()}</div>;
      default:
        return null;
    }
  }

  renderCandidateList() {
    const className = this.hasFooter() ? 'candidatesList' : 'candidatesList-no-footer';
    return (
      <ul className={className}>
        {this.props.candidates.map((c, i) => (
          <li
            key={c.id}
            ref={(node) => {
              if (i === this.props.index) {
                this.selectedCandidate = node;
              }
            }}
          >
            {this.renderSeparator(i)}
            <Candidate
              item={c}
              isSelected={i === this.props.index}
              isMarked={!!this.props.markedCandidateIds[c.id]}
              onClick={() => this.handleCandidateClick(i)}
            />
          </li>
        ))
       }
      </ul>
    );
  }

  renderSeparator(index) {
    return this.props.separators.filter(s => s.index === index && s.label).map(s => ((
      <div key={`separator${index}`} className="separator">{s.label}</div>
    )));
  }

  render() {
    return (
      <form
        className="commandForm"
      >
        <input
          className="commandInput"
          ref={this.setTextInputRef}
          type="text"
          onChange={e => this.props.handleInputChange(e.target.value)}
          onKeyDown={this.props.handleKeyDown}
          placeholder={getMessage('commandInput_placeholder')}
        />
        {this.renderCandidateList()}
        {this.renderFooter()}
      </form>
    );
  }
}

export default PopupPage;
