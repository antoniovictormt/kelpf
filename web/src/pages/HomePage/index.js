import React from 'react';
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FiCopy, FiCrop } from 'react-icons/fi';

import Header from '../../components/Header';
import ShortenerService from '../../services/shortenerService';
import vars from '../../configs/vars';

import {
  ContentContainer,
  Form
} from './styles';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      url: '',
      code: '',
      errorMessage: '',
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { url } = this.state;

    this.setState({ isLoading: true, errorMessage: '' });

    if (!url) {
      this.setState({
        isLoading: false, errorMessage: 'Enter a URL to shorten.'
      });
    } else {
      try {
        const service = new ShortenerService();
        const result = await service.generate({ url });

        this.setState({ isLoading: false, code: result.code });
      } catch (error) {
        this.setState({ isLoading: false, errorMessage: 'Oops, there was an error trying to shorten the url.' });
      }
    }
  }

  copyToClipboard = () => {
    const element = this.inputURL;
    element.select();
    document.execCommand('copy');
  }

  render() {
    const { isLoading, errorMessage, code } = this.state;
    return (
      <Container>
        <Header title="tudo">
          Your new Url shortener
        </Header>
        <ContentContainer>
          <Form onSubmit={this.handleSubmit}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter url to shorten"
                defaultValue=""
                onChange={e => this.setState({ url: e.target.value })}
              />
              <InputGroup.Append>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}>
                  <FiCrop />
                </Button>
              </InputGroup.Append>
            </InputGroup>

            {isLoading ? (
              <Spinner animation="border" />
            ) : (
                code && (
                  <>
                    <InputGroup>
                      <FormControl
                        autoFocus={true}
                        defaultValue={vars.HOST_APP + code}
                        ref={(input) => this.inputURL = input}
                      />
                      <InputGroup.Append>
                        <Button
                          variant="outline-secondary"
                          onClick={() => this.copyToClipboard()}
                          style={{
                            display: "flex",
                            alignItems: "center"
                          }}>
                          <FiCopy />
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <p style={{
                      marginTop: 16,
                    }}>
                      To analyze the statistics, visit: {vars.HOST_APP + code}/stats
                    </p>
                  </>
                )
              )}
            {errorMessage &&
              <Alert variant='danger'>
                {errorMessage}
              </Alert>
            }
          </Form>
        </ContentContainer>
      </Container>
    )
  }
}

export default HomePage;
