import assert from 'assert'
import makeRecorder from './recordevents.js'

describe('record events resource', () => {

  it('should generate proper YAML', function () {
    let recorder = makeRecorder('arecorder')
    recorder.resources.pod.metadata.labels = { e2etest: 'f317a857-6e87-4d78-94b8-ef78e79938d7' }
    recorder.resources.service.spec.selector = { e2etest: 'f317a857-6e87-4d78-94b8-ef78e79938d7' }

    let yaml = recorder.asYAML()

    assert.deepEqual(yaml, `apiVersion: v1
kind: Pod
metadata:
  name: arecorder
  labels:
    e2etest: f317a857-6e87-4d78-94b8-ef78e79938d7
spec:
  containers:
    - name: arecorder
      image: docker.io/villardl/recordevents:latest
      env:
        - name: EVENT_GENERATORS
          value: ''
        - name: EVENT_LOGS
          value: ''
---
apiVersion: v1
kind: Service
metadata:
  name: arecorder
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 8080
  selector:
    e2etest: f317a857-6e87-4d78-94b8-ef78e79938d7
---
`)
  })


  it('should add receiver and sender generators', function () {
    let recorder = makeRecorder('arecorder')
    recorder.resources.pod.metadata.labels = { e2etest: 'f317a857-6e87-4d78-94b8-ef78e79938d7' }
    recorder.resources.service.spec.selector = { e2etest: 'f317a857-6e87-4d78-94b8-ef78e79938d7' }
    recorder.withReceiver()

    let yaml = recorder.asYAML()

    assert.deepEqual(yaml, `apiVersion: v1
kind: Pod
metadata:
  name: arecorder
  labels:
    e2etest: f317a857-6e87-4d78-94b8-ef78e79938d7
spec:
  containers:
    - name: arecorder
      image: docker.io/villardl/recordevents:latest
      env:
        - name: EVENT_GENERATORS
          value: receiver
        - name: EVENT_LOGS
          value: ''
---
apiVersion: v1
kind: Service
metadata:
  name: arecorder
spec:
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: 8080
  selector:
    e2etest: f317a857-6e87-4d78-94b8-ef78e79938d7
---
`)
  })
})