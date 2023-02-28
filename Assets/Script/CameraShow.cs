using System.Runtime.InteropServices;
using UnityEngine.UI;
using UnityEngine;

public class CameraShow : MonoBehaviour
{
    [SerializeField] private Button callButton;
    [SerializeField] private Button hangUpButton;
    [SerializeField] private RawImage sourceImage;
    [SerializeField] private RawImage receiveImage;

    WebCamTexture _webcamTexture;

    private void Awake()
    {
        callButton.onClick.AddListener(Call);
        hangUpButton.onClick.AddListener(HangUp);
    }

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        
    }

    private void Call()
    {
        _webcamTexture = new WebCamTexture();
        sourceImage.texture = _webcamTexture;
        sourceImage.material.mainTexture = _webcamTexture;
        receiveImage.texture = null;
        receiveImage.material.mainTexture = null;

        _webcamTexture.Play();

        callButton.interactable = false;
        hangUpButton.interactable = true;
        test();

        //connect();
    }

    private void HangUp()
    {
        sourceImage.texture = null;
        sourceImage.material.mainTexture = null ;
        receiveImage.texture = null;
        receiveImage.material.mainTexture = null;

        _webcamTexture.Stop();

        callButton.interactable = true;
        hangUpButton.interactable = false;
    }

    [DllImport("__Internal")]
    private static extern void test();

    /*
    #if UNITY_WEBGL
        [DllImport("__Internal")]
        private static extern void onLocalTracks();
        [DllImport("__Internal")]
        private static extern void onRemoteTrack();
        [DllImport("__Internal")]
        private static extern void onConferenceJoined();
        [DllImport("__Internal")]
        private static extern void onUserLeft(int id);
        [DllImport("__Internal")]
        private static extern void onConnectionSuccess();
        [DllImport("__Internal")]
        private static extern void unload();
        [DllImport("__Internal")]
        private static extern void connect();
    #endif
    */
}
